<script>
if(!localStorage.getItem('cart')){
localStorage.setItem('cart',JSON.stringify([]))
}

function addToCart(product,price,img,qty){
let cart=JSON.parse(localStorage.getItem('cart'))
cart.push({product,price,img,qty})
localStorage.setItem('cart',JSON.stringify(cart))

// TikTok events
try{
ttq.track('AddToCart',{
content_name:product,
value:price*qty,
currency:'CZK'
})
}catch(e){}

// Conversion API fallback
fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
event:'AddToCart',
timestamp:Math.floor(Date.now()/1000),
properties:{
content_name:product,
quantity:qty,
price:price
}
})
}).catch(()=>{})
}
</script>
