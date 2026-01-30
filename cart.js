// cart.js

// Получаем корзину из localStorage или создаем пустую
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция обновления отображения корзины
function updateCartUI(){
    const cartDiv = document.getElementById('cart');
    if(!cartDiv) return;

    if(cart.length === 0){
        cartDiv.innerHTML = '<div style="background:#111;padding:12px 18px;border-radius:16px;">Košík je prázdný</div>';
        return;
    }

    let html = '<div style="background:#111;padding:12px;border-radius:16px;max-width:300px;">';
    let total = 0;
    cart.forEach((item,index)=>{
        total += item.price * item.qty;
        html += `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div>
                <strong>${item.name}</strong><br>
                ${item.color}<br>
                ${item.qty} × ${item.price} Kč
            </div>
            <div>
                <button onclick="changeQty(${index},1)" style="margin-bottom:2px;">+</button><br>
                <button onclick="changeQty(${index},-1)">−</button>
            </div>
        </div>
        `;
    });
    html += `<div style="font-weight:bold;margin-top:10px;">Celkem: ${total} Kč</div>`;
    html += `<button onclick="clearCart()" style="margin-top:10px;padding:10px 20px;border:none;border-radius:12px;background:#fff;color:#000;cursor:pointer;">Vyprázdnit košík</button>`;
    html += '</div>';
    cartDiv.innerHTML = html;
}

// Добавление товара в корзину
function addToCart(name,price,img,qty){
    // Проверяем, есть ли уже такой товар с этим цветом
    let existing = cart.find(item => item.name === name && item.color === selectedColorMax);
    if(existing){
        existing.qty += qty;
    } else {
        cart.push({name:name,price:price,img:img,qty:qty,color:selectedColorMax});
    }
    localStorage.setItem('cart',JSON.stringify(cart));
    updateCartUI();
}

// Изменение количества товара
function changeQty(index,delta){
    cart[index].qty += delta;
    if(cart[index].qty < 1) cart.splice(index,1);
    localStorage.setItem('cart',JSON.stringify(cart));
    updateCartUI();
}

// Очистка корзины
function clearCart(){
    cart = [];
    localStorage.setItem('cart',JSON.stringify(cart));
    updateCartUI();
}

// Обновляем корзину при загрузке страницы
window.addEventListener('load',updateCartUI);
