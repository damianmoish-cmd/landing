// cart.js - рабочая корзина для Pro и Max

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function saveCart(){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function addToCart(name, price, img, qty=1, color='Černá'){
    const existing = cartItems.find(item => item.name===name && item.color===color);
    if(existing){
        existing.qty += qty;
    } else {
        cartItems.push({name, price, img, qty, color});
    }
    saveCart();
    openCart();
}

function openCart(){
    const cartDiv = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if(!cartDiv || !overlay) return;

    overlay.style.opacity='1';
    overlay.style.visibility='visible';
    cartDiv.style.right='0';
    renderCart();
}

function closeCart(){
    const cartDiv = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    if(!cartDiv || !overlay) return;

    overlay.style.opacity='0';
    overlay.style.visibility='hidden';
    cartDiv.style.right='-400px';
}

function renderCart(){
    const cartDiv = document.getElementById('cart');
    if(!cartDiv) return;

    if(cartItems.length===0){
        cartDiv.innerHTML='<h2 style="color:#000;">🛒 Košík je prázdný</h2>';
        return;
    }

    let html='<h2 style="color:#000;">🛒 Váš košík</h2>';
    let total=0;

    cartItems.forEach((item,index)=>{
        total+=item.price*item.qty;
        html+=`
        <div style="display:flex;gap:12px;margin-bottom:14px;align-items:center;">
            <img src="${item.img}" style="width:60px;height:60px;border-radius:12px;">
            <div style="flex:1;color:#000;">
                <strong>${item.name}</strong><br>
                Barva: ${item.color}<br>
                ${item.qty} × ${item.price} Kč
            </div>
            <button onclick="removeItem(${index})">❌</button>
        </div>`;
    });

    html+=`<h3 style="color:#000;">Celkem: ${total} Kč</h3>`;
    html+=`<button onclick="checkout()">Objednat vše</button>`;
    cartDiv.innerHTML=html;
}

function removeItem(index){
    cartItems.splice(index,1);
    saveCart();
}

function checkout(){
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    window.location.href='order.html';
}
