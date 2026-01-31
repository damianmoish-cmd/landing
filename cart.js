// cart.js

let qtyPro = 1; // начальное количество

function changeQtyPro(delta) {
    qtyPro = Math.max(1, qtyPro + delta);
    const display = document.getElementById('qtyProDisplay');
    if (display) display.innerText = qtyPro;
    updateCartPrice();
}

// ----------------- КОРЗИНА -----------------
function openCart() {
    document.getElementById('cart').style.right = '0';
    document.getElementById('cart-overlay').style.opacity = '1';
    document.getElementById('cart-overlay').style.visibility = 'visible';
}

function closeCart() {
    document.getElementById('cart').style.right = '-400px';
    document.getElementById('cart-overlay').style.opacity = '0';
    document.getElementById('cart-overlay').style.visibility = 'hidden';
}

function animateCartBtn() {
    const cartBtn = document.getElementById('fixed-cart-btn');
    if (!cartBtn) return;
    cartBtn.style.transform = 'translateY(-10px)';
    setTimeout(() => { cartBtn.style.transform = 'translateY(0)'; }, 200);
}

// ----------------- ДОБАВЛЕНИЕ В КОРЗИНУ -----------------
function addToCart(name = 'Bezdrátová sluchátka Pro 3', price = 1099, img = 'img/airpods1.jpg', qty = qtyPro, color = 'Bílá') {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
        <img src="${img}">
        <div class="cart-item-info">
            <strong>${name}</strong>
            ${color}
            <div class="cart-item-qty">
                <button class="qty-minus">−</button>
                <input type="number" value="${qty}" min="1">
                <button class="qty-plus">+</button>
            </div>
        </div>
        <div class="cart-item-price">${price * qty} Kč</div>
    `;
    cartItems.appendChild(item);

    animateCartBtn();
    openCart();

    const qtyInput = item.querySelector('input');
    const minusBtn = item.querySelector('.qty-minus');
    const plusBtn = item.querySelector('.qty-plus');
    const priceEl = item.querySelector('.cart-item-price');

    function updatePrice() {
        let val = Math.max(1, parseInt(qtyInput.value));
        qtyInput.value = val;
        priceEl.innerText = (val * price) + ' Kč';
        qtyPro = val;
        const display = document.getElementById('qtyProDisplay');
        if (display) display.innerText = val;
    }

    minusBtn.addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value) - 1; updatePrice(); });
    plusBtn.addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value) + 1; updatePrice(); });
    qtyInput.addEventListener('change', updatePrice);
}

// ----------------- ОБНОВЛЕНИЕ ЦЕНЫ В КОРЗИНЕ -----------------
function updateCartPrice() {
    const cartItems = document.querySelectorAll('#cart .cart-item');
    cartItems.forEach(item => {
        const pricePerItem = parseInt(item.querySelector('.cart-item-price').innerText) / qtyPro;
        const qtyInput = item.querySelector('input');
        item.querySelector('.cart-item-price').innerText = (pricePerItem * parseInt(qtyInput.value)) + ' Kč';
    });
    const stickyPrice = document.querySelector('.sticky-price');
    if (stickyPrice) stickyPrice.innerText = (1099 * qtyPro) + ' Kč';
}

// ----------------- ОТПРАВКА НА E-MAIL -----------------
function sendOrder() {
    const cartItems = document.querySelectorAll('#cart .cart-item');
    if (cartItems.length === 0) {
        alert('Košík je prázdný!');
        return;
    }

    let orderDetails = '';
    cartItems.forEach(item => {
        const name = item.querySelector('strong').innerText;
        const qty = item.querySelector('input').value;
        const price = item.querySelector('.cart-item-price').innerText;
        orderDetails += `${name} | Množství: ${qty} | Cena: ${price}\n`;
    });

    // Форму отправки на e-mail через твой backend
    const form = document.getElementById('orderForm'); // <form id="orderForm"> в твоем HTML
    if (!form) {
        alert('Formulář pro objednávku nenalezen!');
        return;
    }

    // Добавляем данные корзины в скрытое поле
    let input = form.querySelector('input[name="cart"]');
    if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cart';
        form.appendChild(input);
    }
    input.value = orderDetails;

    form.submit();
}

// ----------------- ИНИЦИАЛИЗАЦИЯ -----------------
document.addEventListener('DOMContentLoaded', () => {
    const fixedBtn = document.getElementById('fixed-cart-btn');
    if (fixedBtn) fixedBtn.addEventListener('click', openCart);

    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', closeCart);

    const stickyBtn = document.querySelector('.sticky-btn');
    if (stickyBtn) stickyBtn.addEventListener('click', sendOrder);
});
