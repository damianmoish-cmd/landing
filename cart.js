// ===============================
// cart.js — универсальный для всех страниц
// ===============================

// Основная корзина
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let currentLang = 'cs'; // 'cs' или 'ru'

// ---------- Сохранение корзины ----------
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// ---------- Добавление товара ----------
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

// ---------- Открыть / закрыть корзину ----------
function openCart() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (!cart) return;

    cart.style.right = '0';
    if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }
    renderCart();
}

function closeCart() {
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if (!cart) return;

    cart.style.right = '-100%';
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    }
}

// ---------- Удалить товар ----------
function removeItem(index) {
    cartItems.splice(index, 1);
    saveCart();
}
// ---------- Изменение количества ----------
function changeCartQty(index, delta) {
    cartItems[index].qty += delta;

    if (cartItems[index].qty < 1) {
        cartItems[index].qty = 1;
    }

    saveCart();
}

function setCartQty(index, value) {
    const qty = parseInt(value);
    if (qty >= 1) {
        cartItems[index].qty = qty;
        saveCart();
    }
}
// ---------- Оформить заказ ----------
function checkout() {
    if (cartItems.length === 0) return;

    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    window.location.href = 'order.html';
}
}

// ---------- Смена языка ----------
function toggleLang() {
    currentLang = currentLang === 'cs' ? 'ru' : 'cs';
    renderCart();
}

// ---------- Отрисовка корзины ----------
function renderCart() {
    const cart = document.getElementById('cart');
    if (!cart) return;

    if (cartItems.length === 0) {
        cart.innerHTML = `
            <button onclick="closeCart()" style="float:right;">✖</button>
            <h2>${currentLang === 'cs' ? 'Košík je prázdný' : 'Корзина пуста'}</h2>
        `;
        return;
    }

    let total = 0;

    let html = `
        <button onclick="closeCart()" style="float:right;">✖</button>
        <h2>${currentLang === 'cs' ? 'Váš košík' : 'Ваша корзina'}</h2>
    `;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        html += `
        <div style="
            display:flex;
            gap:12px;
            margin-bottom:16px;
            border-bottom:1px solid #222;
            padding-bottom:12px;
            align-items:center;
        ">
            <img src="${item.img}" style="width:60px;height:60px;border-radius:12px;">

            <div style="flex:1">
                <strong>${item.name}</strong><br>
                ${currentLang === 'cs' ? 'Barva' : 'Цвет'}: ${item.color}

                <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
                    <button onclick="changeCartQty(${index}, -1)">−</button>

                    <input type="number"
                        value="${item.qty}"
                        min="1"
                        style="width:50px;text-align:center;"
                        onchange="setCartQty(${index}, this.value)">

                    <button onclick="changeCartQty(${index}, 1)">+</button>
                </div>
            </div>

            <div style="text-align:right">
                <div>${itemTotal} Kč</div>
                <button onclick="removeItem(${index})"
                    style="background:none;border:none;color:#fff;cursor:pointer">
                    ❌
                </button>
            </div>
        </div>
        `;
    });

    html += `
        <h3>${currentLang === 'cs' ? 'Celkem' : 'Итого'}: ${total} Kč</h3>

        <button onclick="checkout()" style="
            display:block;
            margin-top:20px;
            width:100%;
            padding:16px 0;
            border:none;
            border-radius:14px;
            background:#fff;
            color:#000;
            font-weight:bold;
            font-size:16px;
            cursor:pointer;">
            ${currentLang === 'cs' ? 'Odeslat objednávku' : 'Оформить заказ'}
        </button>
    `;

    cart.innerHTML = html;
}
}

// ---------- Авто-подключение кнопки и overlay ----------
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('fixed-cart-btn');
    if (btn) btn.addEventListener('click', openCart);

    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', closeCart);

    renderCart();
});
