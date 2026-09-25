// Precios de ejemplo en lempiras para el proyecto escolar.
// Las fotos son fotografías reales alojadas en Unsplash.
const products = [
  {
    id: 1,
    name: "Mochila de viaje",
    category: "Equipaje",
    price: 349,
    description: "Cómoda para llevar lo esencial en una escapada.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80"
  },
  {
    id: 2,
    name: "Maleta de cabina",
    category: "Equipaje",
    price: 599,
    description: "Tamaño práctico para viajes cortos.",
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=700&q=80"
  },
  {
    id: 3,
    name: "Bolsa organizadora",
    category: "Equipaje",
    price: 89,
    description: "Separa tus accesorios dentro del equipaje.",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=700&q=80"
  },
  {
    id: 4,
    name: "Botella reutilizable",
    category: "Confort",
    price: 99,
    description: "Lleva agua durante tus recorridos.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&q=80"
  },
  {
    id: 5,
    name: "Almohada de viaje",
    category: "Confort",
    price: 149,
    description: "Un poco más de comodidad durante el trayecto.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=700&q=80"
  },
  {
    id: 6,
    name: "Audífonos",
    category: "Tecnología",
    price: 199,
    description: "Escucha música mientras viajas.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80"
  },
  {
    id: 7,
    name: "Cable de carga",
    category: "Tecnología",
    price: 75,
    description: "Un accesorio útil para llevar de repuesto.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&q=80"
  },
  {
    id: 8,
    name: "Cámara compacta",
    category: "Tecnología",
    price: 749,
    description: "Para guardar recuerdos de tu viaje.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80"
  },
  {
    id: 9,
    name: "Candado para maleta",
    category: "Seguridad",
    price: 69,
    description: "Una forma sencilla de asegurar tu equipaje.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=700&q=80"
  },
  {
    id: 10,
    name: "Lentes de sol",
    category: "Cuidado",
    price: 129,
    description: "Para paseos y días soleados.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=80"
  },
  {
    id: 11,
    name: "Protector solar",
    category: "Cuidado",
    price: 159,
    description: "Ideal para incluir en tus viajes a la playa.",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=700&q=80"
  },
  {
    id: 12,
    name: "Gorra para el sol",
    category: "Cuidado",
    price: 109,
    description: "Ligera y fácil de llevar a cualquier destino.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&q=80"
  }
];

const grid = document.getElementById("products-grid");
const productCount = document.getElementById("product-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const summaryCount = document.getElementById("summary-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const toast = document.getElementById("toast");

const STORAGE_KEY = "rumbo_tienda_carrito";
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return {};

    const restored = {};
    saved.forEach(item => {
      const id = Number(item.id);
      const quantity = Number(item.quantity);

      if (
        products.some(product => product.id === id) &&
        Number.isInteger(quantity) &&
        quantity > 0
      ) {
        restored[id] = Math.min(quantity, 99);
      }
    });

    return restored;
  } catch {
    return {};
  }
}

function saveCart() {
  const items = Object.entries(cart).map(([id, quantity]) => ({
    id: Number(id),
    quantity
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // La tienda sigue funcionando si el navegador bloquea el almacenamiento.
  }
}

function money(amount) {
  return `L. ${amount.toFixed(2)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

function renderProducts(category = "all") {
  const visible = category === "all"
    ? products
    : products.filter(product => product.category === category);

  productCount.textContent = `${visible.length} productos disponibles`;

  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <img
        class="product-img"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/700x500/eaf0f0/0c4a52?text=Producto';"
      >
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${money(product.price)}</p>
        <button class="add-to-cart-btn" type="button" data-add="${product.id}">
          + Agregar al carrito
        </button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  let totalItems = 0;
  let subtotal = 0;

  const selected = products.filter(product => cart[product.id] > 0);

  cartItems.innerHTML = selected.length
    ? selected.map(product => {
        const quantity = cart[product.id];
        const lineTotal = product.price * quantity;
        totalItems += quantity;
        subtotal += lineTotal;

        return `
          <article class="cart-item">
            <img
              src="${product.image}"
              alt=""
              onerror="this.onerror=null;this.src='https://placehold.co/150x150/eaf0f0/0c4a52?text=Producto';"
            >
            <div class="cart-item-main">
              <h3>${product.name}</h3>
              <span class="unit-price">${money(product.price)} por unidad</span>

              <div class="cart-item-bottom">
                <div class="quantity-controls">
                  <button class="qty-btn" type="button"
                    data-decrease="${product.id}"
                    aria-label="Quitar una unidad de ${product.name}">−</button>
                  <strong>${quantity}</strong>
                  <button class="qty-btn" type="button"
                    data-increase="${product.id}"
                    aria-label="Agregar una unidad de ${product.name}">+</button>
                </div>
                <span class="line-total">${money(lineTotal)}</span>
              </div>

              <button class="remove-btn" type="button" data-remove="${product.id}">
                Eliminar producto
              </button>
            </div>
          </article>
        `;
      }).join("")
    : `
      <div class="empty-cart">
        <span>🧳</span>
        Tu carrito está vacío.<br>
        ¡Explora los productos para tu próximo viaje!
      </div>
    `;

  cartCount.textContent = totalItems;
  summaryCount.textContent = totalItems;
  cartSubtotal.textContent = money(subtotal);
  cartTotal.textContent = money(subtotal);
  checkoutBtn.disabled = totalItems === 0;
  saveCart();
}

function changeQuantity(id, change) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const newQuantity = (cart[id] || 0) + change;

  if (newQuantity <= 0) {
    delete cart[id];
  } else if (newQuantity <= 99) {
    cart[id] = newQuantity;
  } else {
    showToast("Máximo 99 unidades por producto.");
    return;
  }

  renderCart();
}

// Un solo evento para todos los botones de productos.
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  changeQuantity(id, 1);

  const product = products.find(item => item.id === id);
  showToast(`${product.name} agregado al carrito`);
});

// Botones dentro del carrito.
cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.increase) {
    changeQuantity(Number(button.dataset.increase), 1);
  } else if (button.dataset.decrease) {
    changeQuantity(Number(button.dataset.decrease), -1);
  } else if (button.dataset.remove) {
    delete cart[Number(button.dataset.remove)];
    renderCart();
  }
});

// Categorías.
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    button.classList.add("active");
    renderProducts(button.dataset.category);
  });
});

// Abrir y cerrar el carrito.
document.getElementById("open-cart-btn").addEventListener("click", () => {
  cartModal.showModal();
});

document.getElementById("close-cart-btn").addEventListener("click", () => {
  cartModal.close();
});

cartModal.addEventListener("click", event => {
  if (event.target === cartModal) cartModal.close();
});

// Confirmación de ejemplo: todavía no hay pagos ni base de datos.
checkoutBtn.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) return;

  alert(`¡Pedido confirmado en esta demostración!\nTotal: ${cartTotal.textContent}`);
  cart = {};
  renderCart();
  cartModal.close();
});

renderProducts();
renderCart();