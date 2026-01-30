// cart.js - универсальная корзина для Pro и Max

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function saveCart(){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// Добавление товара в корзину
function addToCart(name, price, img, qty=1, color='Černá'){
    // Проверяем, есть ли такой товар уже в корзине с тем же цветом
    const existing = cartItems.find(item => item.name===name && item.color===color);
    if(existing){
        existing.qty += qty;
    } else {
        cartItems.push({name, price, img, qty, color});
    }
    saveCart();
    openCart();
}

// Открытие корзины
function openCart(){
    const cartDiv = document.getElementById('cart');
    cartDiv.style.right = '0';
    renderCart();
}

// Закрытие корзины
function closeCart(){
    const cartDiv = document.getElementById('cart');
    cartDiv.style.right = '-100%';
}

// Рендер корзины
function renderCart(){
    const cartDiv = document.getElementById('cart');
    if(!cartDiv) return;
    if(cartItems.length===0){
        cartDiv.innerHTML='<h2>🛒 Košík je prázdný</h2>';
        return;
    }
    let html = '<h2>🛒 Váš košík</h2>';
    let total=0;
    cartItems.forEach((item,index)=>{
        total += item.price * item.qty;
        html += `
        <div style="display:flex;gap:12px;margin-bottom:14px;align-items:center;border-bottom:1px solid #222;padding-bottom:12px;">
            <img src="${item.img}" style="width:60px;height:60px;border-radius:12px;">
            <div style="flex:1;">
                <strong>${item.name}</strong><br>
                Barva: ${item.color}<br>
                Cena: ${item.price} Kč<br>
                Množství: 
                <button onclick="changeQty(${index},-1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index},1)">+</button>
            </div>
            <button onclick="removeItem(${index})" style="background:#ff4444;color:#fff;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;">❌</button>
        </div>`;
    });
    html += `<h3>Celkem: ${total} Kč</h3>`;
    html += `<button style="width:100%;padding:16px;border-radius:32px;border:none;font-size:16px;font-weight:700;background:#fff;color:#000;cursor:pointer;margin-top:12px;" onclick="checkout()">Objednat vše</button>`;
    cartDiv.innerHTML = html;
}

// Изменение количества
function changeQty(index, delta){
    cartItems[index].qty = Math.max(1, cartItems[index].qty + delta);
    saveCart();
}

// Удаление товара
function removeItem(index){
    cartItems.splice(index,1);
    saveCart();
}

// Checkout (отправка на order.html с параметрами)
function checkout(){
    if(cartItems.length===0) return;
    // Сохраняем корзину в localStorage, order.html будет её читать
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    window.location.href='order.html';
}

// При загрузке order.html можно прочитать checkoutItems и показать товары
