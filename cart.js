let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, price, img, qty = 1, color = 'Standard') {
    // Если товар уже в корзине, увеличиваем количество
    let existing = cart.find(item => item.product === product && item.color === color);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({product, price, img, qty, color});
    }
    saveCart();
    alert(product + " bylo přidáno do košíku (" + qty + " ks)");
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function updateQty(index, delta) {
    cart[index].qty = Math.max(1, cart[index].qty + delta);
    saveCart();
    renderCart();
}

function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCart() {
    return cart;
}

// Для отображения на странице order.html
function renderCart() {
    let box = document.getElementById('cart');
    if (!box) return;
    box.innerHTML = '';
    cart.forEach((i, idx) => {
        box.innerHTML += `
        <div class="cart-item">
            <img src="${i.img}">
            <div>
                <strong>${i.product}</strong><br>
                Barva: ${i.color}<br>
                ${i.price} Kč × ${i.qty}<br>
                <button onclick="updateQty(${idx},-1)">−</button>
                <button onclick="updateQty(${idx},1)">+</button>
                <button onclick="removeItem(${idx})">✕</button>
            </div>
        </div>`;
    });
    document.getElementById('total').innerText = cartTotal() + " Kč";
}
