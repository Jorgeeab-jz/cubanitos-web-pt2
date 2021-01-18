const animateCSS = (element, animation, prefix = 'animate__') =>{
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
})};
const accBtn = document.querySelectorAll('.accordion-button');
const cartBtn = document.querySelector('.cart-btn-container');
const cartQtyDisplay = document.getElementById('cart-qty-display');


function updateCartIcon() {
    let items = [...document.querySelectorAll('.item')];
    if (items.length > 0){
        cartQtyDisplay.innerText = items.length;
    }else{
        cartQtyDisplay.innerText = '';
    }
}

accBtn.forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    document.querySelector('.menu-title').scrollIntoView(true);
  })
})

function hideAddToCart (){
  cart.extraModal.toggle()
}

function displayCartBtn (){
  let items = [...document.querySelectorAll('.item')];

  if (items.length > 0){
    cartBtn.style.display = 'block';
  }else{
    cartBtn.style.display = 'none';
  }
}