
const cart = (function(){
    const cartBody = document.getElementById('cart-body');
    const extraModal = new bootstrap.Modal(document.getElementById('extraModal'), {
    keyboard: false
    })
    
    const generateCartItem = ()=>{
    let name = document.getElementById('current-item-name')
    .innerText;
    let price = document.getElementById('pre-cart-total')
    .dataset.price;
    let cookMessage = document.getElementById('cook-message')
    .value;
    let message = '';

    let itemContainer = document.createElement('div')
    itemContainer.classList.add('item');

    let itemInfo = document.createElement('div')
    itemInfo.classList.add('item-info');

    let extrasContainer = document.createElement('div');
    extrasContainer.classList.add('extras');

    let extras = document.querySelectorAll('.extra-input input');
    let extraList = '';
    extras.forEach(extra=>{
        if(extra.checked){
            let extraBadge = document.createElement('span');
            extraBadge.classList.add('badge');
            extraBadge.style.background = extra.dataset.color;
            extraBadge.innerText = extra.dataset.name;

            extrasContainer.append(extraBadge);
            extraList += `${extra.dataset.name}\n`;
        }
    })
    


    let itemInput = document.createElement('div')
    itemInput.classList.add('item-input');

    let qtyInput = document.createElement('input')
    qtyInput.value = 1;
    qtyInput.dataset.price = price;
    qtyInput.classList.add('qty');
    qtyInput.setAttribute('type','number')
    qtyInput.addEventListener('change', (e)=>{
        let input = e.target;
        if (isNaN(input.value) || input.value <= 0){
            input.value = 1
        }else if (input.value >= 99) {
            input.value = 99
        }
        updateTotal();
        buildMessage();
    });

    let lessBtn = document.createElement('button')
    lessBtn.innerHTML = '<i class="fas fa-minus-circle"></i>';
    lessBtn.addEventListener('click', (e)=>{
        let input = e.target.closest('div').querySelector('input');
        let inputN = Number(input.value);
        if (inputN > 1) {
            input.value = inputN - 1;
        }
        updateTotal();
        buildMessage();
    });

    let addBtn = document.createElement('button')
    addBtn.innerHTML = '<i class="fas fa-plus-circle"></i>';
    addBtn.addEventListener('click', (e)=>{
        let input = e.target.closest('div').querySelector('input');
        let inputN = Number(input.value);
        input.value = inputN + 1;
        updateTotal();
        buildMessage();
    });

    itemInput.append(lessBtn,qtyInput,addBtn);


    let itemName = document.createElement('h3')
    itemName.classList.add('item-name')
    itemName.innerText = name;

    itemInfo.append(itemInput,itemName);

    let priceContainer = document.createElement('div')
    priceContainer.dataset.price = price
    priceContainer.classList.add('item-price');

    let removeBtn = document.createElement('button')
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.classList.add('item-remove')
    removeBtn.addEventListener('click',(e)=>{
        let row = e.target.closest('.item');
        row.remove();
        updateTotal();
        updateCartIcon();
        displayCartBtn();
    })

    let buildMessage = ()=>{
        message = `${qtyInput.value} ${itemName.innerText}\n`
        if(extraList !== ''){
            message += `Extras:\n${extraList}\n`;
        }
        if(cookMessage !== ''){
            message += `Nota: ${cookMessage}\n`;
        }
        message += `Precio: ${logistic.addDot(price)}.BSS\n//////////////////////\n`;
        itemContainer.dataset.message = message;
    }

    let itemPrice = document.createElement('p')
    itemPrice.innerText = `${logistic.addDot(price)}.BSS`;

    priceContainer.append(removeBtn,itemPrice);

    itemContainer.append(itemInfo,extrasContainer,priceContainer);
    buildMessage();
    cartBody.append(itemContainer);
    updateTotal();
   }
   
   const updateTotal = ()=>{
       let total = 0;
       let items = document.querySelectorAll('.qty');

       items.forEach(item =>{
           let value = Number(item.dataset.price);
           let qty = Number(item.value);
           let cost = value * qty;

           total += cost;
       })

       

       if (del.checked){
           total += Number(del.dataset.price);
       }
       total = Math.round(total * 100) / 100;
       let totalDisplay = document.getElementById('total-display');
       totalDisplay.dataset.total = total;
       totalDisplay.innerText = `${logistic.addDot(total)}.BSS`;
    }

   const _getOrder = ()=>{
       let items = document.querySelectorAll('.item');
       let message = 'Pedido:\n';
       let total = document.getElementById('total-display').innerText;

       items.forEach(item=>{
           message += item.dataset.message;
       })

       if(del.checked){
           message += `Modo de entrega: Delivery   
           ${logistic.addDot(Number(del.dataset.price))}\n______________________\n`;
       }else if(pU.checked){
           message += `Modo de entrega: Pick-Up\n______________________\n`
       }

       message += `TOTAL: ${total}`;
       console.log(message)
       return message;
   }

   const sendOrder = ()=>{
       let total = Number(document.getElementById('total-display').dataset.total);
        console.log(encodeURIComponent(_getOrder()))
       
        if(total > 0){
        
            window.open(`https://wa.me/584128691901?text=${encodeURIComponent(_getOrder())}`);
        
        }
   }

    return {
        extraModal,
        generateCartItem,
        updateTotal,
        sendOrder
    }
})();



const addCartBtn = document.getElementById('add-cart-btn');
addCartBtn.addEventListener('click', ()=>{
    cart.generateCartItem();
    cart.updateTotal();
    hideAddToCart();
    animateCSS('.cart-btn-container', 'swing');
    updateCartIcon();
    displayCartBtn();
});

const sendOrderBtn = document.getElementById('send-btn');
sendOrderBtn.addEventListener('click',()=>{
    cart.sendOrder();
    inventory.checkOnline();
}); 

const del = document.getElementById('delivery');
const pU = document.getElementById('pickUp');
del.addEventListener('change',cart.updateTotal);
pU.addEventListener('change',cart.updateTotal);