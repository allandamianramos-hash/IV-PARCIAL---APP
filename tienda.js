// ============================================================
// LA TIENDA DEL VIAJERO | RUMBO
// ============================================================


// ============================================================
// PRODUCTOS
// ============================================================

const products = [

    // =========================
    // EQUIPAJE
    // =========================

    {
        id: 1,
        name: "Mochila de viaje",
        category: "Equipaje",
        price: 450,
        image: "imagenes/mochila.jpg",
        description: "Mochila práctica para llevar tus cosas durante el viaje."
    },

    {
        id: 2,
        name: "Maleta de viaje",
        category: "Equipaje",
        price: 650,
        image: "imagenes/maleta.jpg",
        description: "Maleta para organizar y transportar tu equipaje."
    },

    {
        id: 3,
        name: "Bolso de mano",
        category: "Equipaje",
        price: 250,
        image: "imagenes/bolso-mano.jpg",
        description: "Bolso cómodo para llevar objetos personales."
    },

    {
        id: 4,
        name: "Riñonera",
        category: "Equipaje",
        price: 120,
        image: "imagenes/rinonera.jpg",
        description: "Riñonera compacta para llevar objetos pequeños."
    },

    {
        id: 5,
        name: "Etiqueta para maleta",
        category: "Equipaje",
        price: 50,
        image: "imagenes/etiqueta-maleta.jpg",
        description: "Etiqueta para identificar fácilmente tu equipaje."
    },

    {
        id: 6,
        name: "Candado para maleta",
        category: "Equipaje",
        price: 80,
        image: "imagenes/candado-maleta.jpg",
        description: "Candado compacto para asegurar tu equipaje."
    },


    // =========================
    // TECNOLOGÍA
    // =========================

    {
        id: 7,
        name: "Power Bank",
        category: "Tecnología",
        price: 350,
        image: "imagenes/power-bank.jpg",
        description: "Batería portátil para mantener cargado tu celular."
    },

    {
        id: 8,
        name: "Cargador de celular",
        category: "Tecnología",
        price: 150,
        image: "imagenes/cargador.jpg",
        description: "Cargador práctico para usar durante tus viajes."
    },

    {
        id: 9,
        name: "Cable USB",
        category: "Tecnología",
        price: 70,
        image: "imagenes/cable-usb.jpg",
        description: "Cable USB para cargar y conectar dispositivos."
    },

    {
        id: 10,
        name: "Adaptador universal",
        category: "Tecnología",
        price: 220,
        image: "imagenes/adaptador.jpg",
        description: "Adaptador para conectar dispositivos en diferentes lugares."
    },

    {
        id: 11,
        name: "Audífonos",
        category: "Tecnología",
        price: 180,
        image: "imagenes/audifonos.jpg",
        description: "Audífonos para escuchar música durante el viaje."
    },

    {
        id: 12,
        name: "Soporte para celular",
        category: "Tecnología",
        price: 100,
        image: "imagenes/soporte-celular.jpg",
        description: "Soporte pequeño y práctico para tu celular."
    },


    // =========================
    // CONFORT
    // =========================

    {
        id: 13,
        name: "Almohada de viaje",
        category: "Confort",
        price: 180,
        image: "imagenes/almohada-viaje.jpg",
        description: "Almohada cómoda para descansar durante el viaje."
    },

    {
        id: 14,
        name: "Botella reutilizable",
        category: "Confort",
        price: 120,
        image: "imagenes/botella.jpg",
        description: "Botella reutilizable para llevar agua."
    },

    {
        id: 15,
        name: "Antifaz para dormir",
        category: "Confort",
        price: 60,
        image: "imagenes/antifaz.jpg",
        description: "Antifaz para descansar con mayor comodidad."
    },

    {
        id: 16,
        name: "Tapones para oídos",
        category: "Confort",
        price: 45,
        image: "imagenes/tapones-oidos.jpg",
        description: "Tapones pequeños para descansar durante el viaje."
    },

    {
        id: 17,
        name: "Paraguas compacto",
        category: "Confort",
        price: 150,
        image: "imagenes/paraguas.jpg",
        description: "Paraguas compacto para llevar fácilmente."
    },

    {
        id: 18,
        name: "Toalla de viaje",
        category: "Confort",
        price: 130,
        image: "imagenes/toalla-viaje.jpg",
        description: "Toalla práctica y fácil de transportar."
    },


    // =========================
    // SEGURIDAD
    // =========================

    {
        id: 19,
        name: "Porta pasaporte",
        category: "Seguridad",
        price: 100,
        image: "imagenes/porta-pasaporte.jpg",
        description: "Funda para mantener protegido tu pasaporte."
    },

    {
        id: 20,
        name: "Porta documentos",
        category: "Seguridad",
        price: 120,
        image: "imagenes/porta-documentos.jpg",
        description: "Organizador para documentos importantes."
    },

    {
        id: 21,
        name: "Billetera de viaje",
        category: "Seguridad",
        price: 110,
        image: "imagenes/billetera.jpg",
        description: "Billetera práctica para guardar dinero y tarjetas."
    },

    {
        id: 22,
        name: "Bolsa impermeable",
        category: "Seguridad",
        price: 100,
        image: "imagenes/bolsa-impermeable.jpg",
        description: "Bolsa para proteger objetos de la humedad."
    },

    {
        id: 23,
        name: "Correa para maleta",
        category: "Seguridad",
        price: 90,
        image: "imagenes/correa-maleta.jpg",
        description: "Correa para sujetar y reconocer tu maleta."
    },

    {
        id: 24,
        name: "Linterna",
        category: "Seguridad",
        price: 100,
        image: "imagenes/linterna.jpg",
        description: "Linterna pequeña para llevar durante el viaje."
    },


    // =========================
    // CUIDADO
    // =========================

    {
        id: 25,
        name: "Neceser de viaje",
        category: "Cuidado",
        price: 130,
        image: "imagenes/neceser.jpg",
        description: "Neceser para organizar artículos personales."
    },

    {
        id: 26,
        name: "Botellas para líquidos",
        category: "Cuidado",
        price: 80,
        image: "imagenes/botellas-liquidos.jpg",
        description: "Botellas pequeñas para llevar líquidos."
    },

    {
        id: 27,
        name: "Cepillo de dientes de viaje",
        category: "Cuidado",
        price: 55,
        image: "imagenes/cepillo-dientes.jpg",
        description: "Cepillo compacto para llevar en el equipaje."
    },

    {
        id: 28,
        name: "Kit de higiene",
        category: "Cuidado",
        price: 150,
        image: "imagenes/kit-higiene.jpg",
        description: "Kit práctico para artículos de higiene personal."
    },

    {
        id: 29,
        name: "Protector solar",
        category: "Cuidado",
        price: 180,
        image: "imagenes/protector-solar.jpg",
        description: "Protector solar para incluir en tu equipaje."
    },

    {
        id: 30,
        name: "Botiquín básico",
        category: "Cuidado",
        price: 200,
        image: "imagenes/botiquin.jpg",
        description: "Botiquín básico para llevar artículos de primeros auxilios."
    }

];


// ============================================================
// CUANDO CARGUE COMPLETAMENTE EL HTML
// ============================================================

document.addEventListener("DOMContentLoaded", function () {


    // ========================================================
    // ELEMENTOS DEL HTML
    // ========================================================

    const productsGrid =
        document.getElementById("products-grid");

    const productsResult =
        document.getElementById("products-result");

    const cartModal =
        document.getElementById("cart-modal");

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const cartSubtotal =
        document.getElementById("cart-subtotal");

    const cartTotal =
        document.getElementById("cart-total");

    const openCartBtn =
        document.getElementById("open-cart-btn");

    const closeCartBtn =
        document.getElementById("close-cart-btn");

    const closeCartOverlay =
        document.getElementById("close-cart-overlay");

    const checkoutBtn =
        document.getElementById("checkout-btn");

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    // ========================================================
    // CARRITO
    // ========================================================

    let cart = [];


    // ========================================================
    // FORMATO DE PRECIO
    // ========================================================

    function formatPrice(price) {

        return "L. " + price.toFixed(2);

    }


    // ========================================================
    // MOSTRAR PRODUCTOS
    // ========================================================

    function displayProducts(category = "Todos") {

        productsGrid.innerHTML = "";


        let productsToShow;


        if (category === "Todos") {

            productsToShow = products;

        } else {

            productsToShow =
                products.filter(function (product) {

                    return product.category === category;

                });

        }


        productsToShow.forEach(function (product) {


            const card =
                document.createElement("article");


            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-image-container">

                    <img
                        class="product-image"
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>


                    <h3 class="product-name">
                        ${product.name}
                    </h3>


                    <p class="product-description">
                        ${product.description}
                    </p>


                    <div class="product-bottom">

                        <span class="product-price">
                            ${formatPrice(product.price)}
                        </span>


                        <button
                            class="add-btn"
                            data-id="${product.id}"
                        >
                            Agregar
                        </button>

                    </div>

                </div>

            `;


            productsGrid.appendChild(card);

        });


        productsResult.textContent =
            productsToShow.length +
            (productsToShow.length === 1
                ? " producto"
                : " productos");

    }


    // ========================================================
    // AGREGAR PRODUCTO
    // ========================================================

    function addToCart(id) {

        const product =
            products.find(function (item) {

                return item.id === id;

            });


        if (!product) {
            return;
        }


        const existing =
            cart.find(function (item) {

                return item.id === id;

            });


        if (existing) {

            existing.quantity++;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: product.price,

                image: product.image,

                quantity: 1

            });

        }


        updateCart();

    }


    // ========================================================
    // ACTUALIZAR CARRITO
    // ========================================================

    function updateCart() {

        cartItems.innerHTML = "";


        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div style="font-size:42px;">
                        🛒
                    </div>

                    <strong>
                        Tu carrito está vacío
                    </strong>

                    <p>
                        Agrega productos para comenzar tu compra.
                    </p>

                </div>

            `;

        } else {


            cart.forEach(function (item) {


                const itemSubtotal =
                    item.price * item.quantity;


                const div =
                    document.createElement("div");


                div.className =
                    "cart-item";


                div.innerHTML = `

                    <img
                        class="cart-item-image"
                        src="${item.image}"
                        alt="${item.name}"
                    >


                    <div>

                        <div class="cart-item-name">
                            ${item.name}
                        </div>


                        <div class="cart-item-price">
                            Precio unitario:
                            ${formatPrice(item.price)}
                        </div>


                        <div class="cart-item-subtotal">
                            Subtotal:
                            ${formatPrice(itemSubtotal)}
                        </div>


                        <div class="cart-item-controls">

                            <div class="quantity-controls">

                                <button
                                    class="quantity-btn"
                                    data-id="${item.id}"
                                    data-action="minus"
                                >
                                    −
                                </button>


                                <strong>
                                    ${item.quantity}
                                </strong>


                                <button
                                    class="quantity-btn"
                                    data-id="${item.id}"
                                    data-action="plus"
                                >
                                    +
                                </button>

                            </div>


                            <button
                                class="remove-btn"
                                data-id="${item.id}"
                                data-action="remove"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                `;


                cartItems.appendChild(div);

            });

        }


        let totalQuantity = 0;

        let subtotal = 0;


        cart.forEach(function (item) {

            totalQuantity += item.quantity;

            subtotal +=
                item.price * item.quantity;

        });


        cartCount.textContent =
            totalQuantity;


        cartSubtotal.textContent =
            formatPrice(subtotal);


        cartTotal.textContent =
            formatPrice(subtotal);

    }


    // ========================================================
    // CAMBIAR CANTIDAD
    // ========================================================

    function changeQuantity(id, amount) {

        const item =
            cart.find(function (product) {

                return product.id === id;

            });


        if (!item) {
            return;
        }


        item.quantity += amount;


        if (item.quantity <= 0) {

            cart =
                cart.filter(function (product) {

                    return product.id !== id;

                });

        }


        updateCart();

    }


    // ========================================================
    // ELIMINAR
    // ========================================================

    function removeFromCart(id) {

        cart =
            cart.filter(function (product) {

                return product.id !== id;

            });


        updateCart();

    }


    // ========================================================
    // CLIC EN PRODUCTOS
    // ========================================================

    productsGrid.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(".add-btn");


            if (!button) {
                return;
            }


            const id =
                Number(button.dataset.id);


            addToCart(id);

        }
    );


    // ========================================================
    // CLIC EN CARRITO
    // ========================================================

    cartItems.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            const id =
                Number(button.dataset.id);


            const action =
                button.dataset.action;


            if (action === "plus") {

                changeQuantity(id, 1);

            }


            if (action === "minus") {

                changeQuantity(id, -1);

            }


            if (action === "remove") {

                removeFromCart(id);

            }

        }
    );


    // ========================================================
    // ABRIR CARRITO
    // ========================================================

    openCartBtn.addEventListener(
        "click",
        function () {

            cartModal.classList.remove("hidden");

        }
    );


    // ========================================================
    // CERRAR CARRITO
    // ========================================================

    function closeCart() {

        cartModal.classList.add("hidden");

    }


    closeCartBtn.addEventListener(
        "click",
        closeCart
    );


    closeCartOverlay.addEventListener(
        "click",
        closeCart
    );


    // ========================================================
    // FILTROS
    // ========================================================

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {


                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const category =
                        button.dataset.category;


                    displayProducts(category);

                }
            );

        }
    );


    // ========================================================
    // FINALIZAR COMPRA
    // ========================================================

    checkoutBtn.addEventListener(
        "click",
        function () {


            if (cart.length === 0) {

                alert(
                    "Tu carrito está vacío."
                );

                return;

            }


            let total = 0;


            cart.forEach(
                function (item) {

                    total +=
                        item.price *
                        item.quantity;

                }
            );


            alert(

                "Compra registrada correctamente.\n\n" +

                "Total: " +
                formatPrice(total) +

                "\nEnvío: GRATIS\n\n" +

                "Gracias por comprar en " +
                "La tienda del viajero | Rumbo."

            );


            cart = [];


            updateCart();


            closeCart();

        }
    );


    // ========================================================
    // INICIAR
    // ========================================================

    displayProducts();

    updateCart();

});