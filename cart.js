// ===============================
// cart.js — совместим со ВСЕМИ страницами
// Работает с order.html (checkoutItems)
// ===============================

// Основная корзина
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// ---------- helpers ----------
function saveCart(){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// ---------- add ----------
function addToCart(name, price, img, qty = 1, color = 'Černá'){
    const existing = cartItems.find(
        item => item.name === name && item.color === color
    );

    if(existing){
        existing.qty += qty;
    } else {
        cartItems.push({ name, price, img, qty, color });
    }

    saveCart();
    openCart();
}

// ---------- open / close ----------
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

// ---------- render ----------
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

// ---------- remove ----------
function removeItem(index){
    cartItems.splice(index, 1);
    saveCart();
}

// ---------- checkout ----------
function checkout(){
    if(cartItems.length === 0) return;

    // 🔑 ВАЖНО: order.html читает ИМЕННО checkoutItems
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    window.location.href = 'order.html';
}
