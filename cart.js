// ===============================
// cart.js — совместим со ВСЕМИ страницами
// Работает с order.html (checkoutItems)
// ===============================

// Получаем корзину из localStorage или создаем пустую
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Сохраняем корзину
function saveCart(){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// Добавление товара
function addToCart(name, price, img, qty = 1, color = 'Bílá'){
    // Проверка, есть ли уже такой товар с этим цветом
    const existing = cartItems.find(item => item.name === name && item.color === color);

    if(existing){
        existing.qty += qty;
    } else {
        cartItems.push({ name, price, img, qty, color });
    }

    saveCart();
    openCart();
}

// Открыть корзину
function openCart(){
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');

    if(!cart) return;

    if(overlay){
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }

    cart.style.right = '0';
    renderCart();
}

// Закрыть корзину
function closeCart(){
    const cart = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');

    if(!cart) return;

    if(overlay){
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    }

    cart.style.right = '-100%';
}

// Рендер корзины
function renderCart(){
    const cart = document.getElementById('cart');
    if(!cart) return;

    if(cartItems.length === 0){
        cart.innerHTML = `
            <button class="close-cart" onclick="closeCart()">✖ Zavřít</button>
            <h2>🛒 Košík je prázdný</h2>
        `;
        return;
    }

    let html = `<button class="close-cart" onclick="closeCart()">✖ Zavřít</button>
                <h2>🛒 Váš košík</h2>`;
    let total = 0;

    cartItems.forEach((item, index) => {
        total += item.price * item.qty;

        html += `
        <div style="display:flex;gap:12px;margin-bottom:16px;
                    border-bottom:1px solid #222;padding-bottom:12px;">
            <img src="${item.img}" style="width:60px;height:60px;border-radius:12px;">
            <div style="flex:1">
                <strong>${item.name}</strong><br>
                Barva: ${item.color}<br>
                ${item.qty} × ${item.price} Kč
            </div>
            <button onclick="removeItem(${index})"
                style="background:none;border:none;color:#fff;cursor:pointer">
                ❌
            </button>
        </div>`;
    });

    html += `<h3>Celkem: ${total} Kč</h3>
             <button onclick="checkout()">Objednat</button>`;

    cart.innerHTML = html;
}

// Удаление товара
function removeItem(index){
    cartItems.splice(index, 1);
    saveCart();
}

// Перейти на страницу заказа
function checkout(){
    if(cartItems.length === 0) return;

    // 🔑 Сохраняем товары для order.html
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));

    // Можно очистить корзину после перехода, если нужно
    // cartItems = [];
    // saveCart();

    // Переход на форму заказа
    window.location.href = 'order.html';
}

// Инициализация кнопок
document.addEventListener('DOMContentLoaded',()=>{
    const cartBtn = document.getElementById('fixed-cart-btn');
    if(cartBtn) cartBtn.addEventListener('click', openCart);

    const overlay = document.getElementById('cart-overlay');
    if(overlay) overlay.addEventListener('click', closeCart);
});
