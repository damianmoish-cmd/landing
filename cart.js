// cart.js с плавной анимацией и фоном

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const cartDiv = document.getElementById('cart');
const overlay = document.getElementById('cart-overlay');

function saveCart(){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function addToCart(name, price, img, qty=1, color='Černá'){
    qty = parseInt(qty) || 1;
    const existing = cartItems.find(item => item.name===name && item.color===color);
    if(existing){
        existing.qty += qty;
    } else {
        cartItems.push({name, price, img, qty, color});
    }
    saveCart();
    openCart();
}

// Открытие корзины с анимацией
function openCart(){
    if(!cartDiv || !overlay) return;
    cartDiv.style.right = '0';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    renderCart();
}

// Закрытие корзины
function closeCart(){
    if(!cartDiv || !overlay) return;
    cartDiv.style.right = '-400px';
    overlay.style.opacity = '0';
    setTimeout(()=>overlay.style.visibility='hidden', 300);
}

// Закрытие по клику на фон
if(overlay){
    overlay.addEventListener('click', closeCart);
}

// Рендер корзины
function renderCart(){
    if(!cartDiv) return;

    if(cartItems.length===0){
        cartDiv.innerHTML = `
            <h2>🛒 Košík je prázdný</h2>
            <button onclick="closeCart()" style="margin-top:16px;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;">Zavřít</button>
        `;
        return;
    }

    let total=0;
    let html='<h2>🛒 Váš košík</h2>';

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
                <button data-index="${index}" data-delta="-1" class="qty-change-btn">−</button>
                <span>${item.qty}</span>
                <button data-index="${index}" data-delta="1" class="qty-change-btn">+</button>
            </div>
            <button data-index="${index}" class="remove-item-btn" style="background:#ff4444;color:#fff;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;">❌</button>
        </div>`;
    });

    html += `<h3>Celkem: ${total} Kč</h3>`;
    html += `<button style="width:100%;padding:16px;border-radius:32px;border:none;font-size:16px;font-weight:700;background:#fff;color:#000;cursor:pointer;margin-top:12px;" onclick="checkout()">Objednat vše</button>`;
    html += `<button onclick="closeCart()" style="margin-top:12px;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;">Zavřít</button>`;

    cartDiv.innerHTML = html;

    // Обработчики кнопок
    cartDiv.querySelectorAll('.qty-change-btn').forEach(btn=>{
        btn.addEventListener('click', function(){
            const index = parseInt(this.dataset.index);
            const delta = parseInt(this.dataset.delta);
            changeQty(index, delta);
        });
    });

    cartDiv.querySelectorAll('.remove-item-btn').forEach(btn=>{
        btn.addEventListener('click', function(){
            const index = parseInt(this.dataset.index);
            removeItem(index);
        });
    });
}

function changeQty(index, delta){
    if(cartItems[index]){
        cartItems[index].qty = Math.max(1, cartItems[index].qty + delta);
        saveCart();
    }
}

function removeItem(index){
    cartItems.splice(index,1);
    saveCart();
}

function checkout(){
    if(cartItems.length===0) return;
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    window.location.href='order.html';
}
