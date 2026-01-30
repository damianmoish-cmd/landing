<script>
function getCart(){
return JSON.parse(localStorage.getItem('cart')||'[]');
}

function saveCart(cart){
localStorage.setItem('cart',JSON.stringify(cart));
}

function addToCart(product,price,img,qty,color){
let cart=getCart();
let found=cart.find(i=>i.product===product && i.color===color);
if(found){
found.qty+=qty;
}else{
cart.push({product,price,img,qty,color});
}
saveCart(cart);

try{
ttq.track('AddToCart',{
content_name:product,
value:price*qty,
currency:'CZK'
});
}catch(e){}
}

function cartTotal(){
return getCart().reduce((s,i)=>s+i.price*i.qty,0);
}
</script>
