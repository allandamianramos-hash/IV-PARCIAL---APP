// 1. Inventario de Productos (12 elementos corregidos)
const products = [
  // Cuidado Personal
  { id: 1, name: "Bloqueador solar", price: 350, category: "Cuidado", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Botiquín primeros auxilios", price: 400, category: "Cuidado", image: "https://images.unsplash.com/photo-1584308666744-24d5e4785ea6?auto=format&fit=crop&w=400&q=80" },
  
  // Equipaje
  { id: 3, name: "Mochila de viaje", price: 850, category: "Equipaje", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Cubos de Embalaje", price: 450, category: "Equipaje", image: "https://images.unsplash.com/photo-1502301197179-65228ab57f78?auto=format&fit=crop&w=400&q=80" },
  
  // Tecnología
  { id: 5, name: "Adaptador Universal", price: 250, category: "Tecnología", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Batería Portátil", price: 650, category: "Tecnología", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=400&q=80" },
  { id: 7, name: "Báscula Digital", price: 280, category: "Tecnología", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=400&q=80" },

  // Confort
  { id: 8, name: "Almohada de cuello", price: 350, category: "Confort", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80" },
  { id: 9, name: "Antifaz para dormir", price: 150, category: "Confort", image: "https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?auto=format&fit=crop&w=400&q=80" },

  // Seguridad
  { id: 10, name: "Candado TSA", price: 200, category: "Seguridad", image: "https://images.unsplash.com/photo-1512462310126-a67b93a26868?auto=format&fit=crop&w=400&q=80" },
  { id: 11, name: "Riñonera Oculta", price: 320, category: "Seguridad", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80" },
  
  // Accesorios extra
  { id: 12, name: "Botella Térmica", price: 300, category: "Accesorios", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80" }
];

// Variables globales
let cart = [];
const productsGrid = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const cartModal = document.getElementById('cart-modal');

// 2. Renderizar los productos en la cuadrícula
function renderProducts(category = 'all') {
  productsGrid.innerHTML = '';
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);
  
  filteredProducts.forEach(product => {
    productsGrid.innerHTML += `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        <h3>${product.name}</h3>
        <p class="product-price">L. ${product.price.toLocaleString('es-HN')}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Agregar al carrito</button>
      </article>
    `;
  });
}

// 3. Agregar al carrito
window.addToCart = function(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCartUI();
};

// 4. Cambiar cantidades
window.changeQuantity = function(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
  }
};

// 5. Actualizar la interfaz del carrito y calcular totales
function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  let subtotal = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align:center; color:#666;">Tu carrito está vacío.</p>';
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cart.forEach(item => {
      subtotal += (item.price * item.quantity);
      totalItems += item.quantity;

      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${item.name}</strong><br>
            <small>L. ${item.price.toLocaleString('es-HN')} c/u</small>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
    });
  }

  // Actualizar textos de precio y contador
  const formattedSubtotal = `L. ${subtotal.toLocaleString('es-HN')}`;
  cartSubtotalEl.textContent = formattedSubtotal;
  cartTotalEl.textContent = formattedSubtotal;
  cartCountEl.textContent = totalItems;
}

// 6. Proceso de compra (Simulación)
checkoutBtn.addEventListener('click', () => {
  // Generar número de pedido aleatorio
  const orderNumber = 'RMB-' + Math.floor(Math.random() * 900000 + 100000);
  
  alert(`¡Compra confirmada!\n\nNúmero de pedido: ${orderNumber}\nTotal pagado: ${cartTotalEl.textContent}\n\nGracias por equiparte con Rumbo.`);
  
  // Vaciar carrito
  cart = [];
  updateCartUI();
  cartModal.close();
});

// 7. Eventos de los botones principales
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  // Abrir y cerrar modal del carrito
  document.getElementById('open-cart-btn').addEventListener('click', () => cartModal.showModal());
  document.getElementById('close-cart-btn').addEventListener('click', () => cartModal.close());

  // Filtros de categoría
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderProducts(e.target.dataset.category);
    });
  });
});