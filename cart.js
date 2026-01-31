let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Язык интерфейса: "cs" — чешский, "ru" — русский
let lang = localStorage.getItem('siteLang') || 'cs';

// Сохранение корзины
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// Добавление товара
function addToCart(name, price, img, qty = 1, color = 'Bílá') {
    const existing = cartItems.find(item => item.name === name && item.color === color);
    if (existing) {
        existing.qty += qty;
    } else {
        cartItems.push({ name, price, img, qty, color });
    }
    saveCart();
    openCart();
}

// Открытие корзины
function openCart() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (!cart) return;

    if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }

    cart.style.right = '0';
    renderCart();
}

// Закрытие корзины
function closeCart() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (!cart) return;

    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    }

    cart.style.right = '-100%';
}

// Рендер корзины
function renderCart() {
    const cart = document.getElementById('cart');
    if (!cart) return;

    let html = `<button class="close-cart" onclick="closeCart()">✖ ${lang==='cs'?'Zavřít':'Закрыть'}</button>`;

    if (cartItems.length === 0) {
        html += `<h2>🛒 ${lang==='cs'?'Košík je prázdný':'Корзина пуста'}</h2>`;
    } else {
        html += `<h2>🛒 ${lang==='cs'?'Váš košík':'Ваша корзина'}</h2>`;
        let total = 0;

        cartItems.forEach((item, index) => {
            total += item.price * item.qty;
            html += `
            <div style="display:flex;gap:12px;margin-bottom:16px;border-bottom:1px solid #222;padding-bottom:12px;">
                <img src="${item.img}" style="width:60px;height:60px;border-radius:12px;">
                <div style="flex:1">
                    <strong>${item.name}</strong><br>
                    ${lang==='cs'?'Barva':'Цвет'}: ${item.color}<br>
                    ${item.qty} × ${item.price} Kč
                </div>
                <button onclick="removeItem(${index})" style="background:none;border:none;color:#fff;cursor:pointer">❌</button>
            </div>`;
        });

        html += `<h3>${lang==='cs'?'Celkem':'Итого'}: ${total} Kč</h3>`;

        // ✅ Кнопка "Оформить заказ / Objednat"
        html += `<button style="margin-top:10px;padding:14px 0;border:none;border-radius:12px;width:100%;background:#fff;color:#000;font-weight:bold;cursor:pointer;" onclick="checkout()">
                    ${lang==='cs'?'Objednat':'Оформить заказ'}
                 </button>`;
    }

    cart.innerHTML = html;
}

// Удаление товара
function removeItem(index) {
    cartItems.splice(index, 1);
    saveCart();
}

// Переход на страницу заказа
function checkout() {
    if (cartItems.length === 0) return;
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    window.location.href = 'order.html';
}

// Инициализация кнопки открытия корзины
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('fixed-cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', openCart);

    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', closeCart);

    renderCart(); // ⚡ сразу отобразим корзину при загрузке
});
