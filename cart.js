const cartBody = document.getElementById('cart-body');
const alertModal = new bootstrap.Modal(document.getElementById('alertModal'), {
    keyboard: false
  })
function generateCartItem(name,price) {
    let itemContainer = document.createElement('div')
    itemContainer.classList.add('item');

    let itemInfo = document.createElement('div')
    itemInfo.classList.add('item-info');

    let itemInput = document.createElement('div')
    itemInput.classList.add('item-input');

    let qtyInput = document.createElement('input')
    qtyInput.value = 1;
    qtyInput.classList.add('qty')
    qtyInput.setAttribute('type','number')
    qtyInput.addEventListener('change', (e)=>{
        let input = e.target;
        if (isNaN(input.value) || input.value <= 0){
            input.value = 1
        }else if (input.value >= 99) {
            input.value = 99
        }
        updateTotal();
    });

    let lessBtn = document.createElement('button')
    lessBtn.innerText = '-'
    lessBtn.addEventListener('click', (e)=>{
        let input = e.target.parentElement.querySelector('input');
        let inputN = Number(input.value);
        if (inputN > 1) {
            input.value = inputN - 1;
            updateTotal();
        }
    });

    let addBtn = document.createElement('button')
    addBtn.innerText = '+'
    addBtn.addEventListener('click', (e)=>{
        let input = e.target.parentElement.querySelector('input');
        let inputN = Number(input.value);
        input.value = inputN + 1;
        updateTotal();
    });

    itemInput.append(lessBtn,qtyInput,addBtn);


    let itemName = document.createElement('h3')
    itemName.classList.add('item-name')
    itemName.innerText = name;

    itemInfo.append(itemInput,itemName);

    let priceContainer = document.createElement('div')
    priceContainer.classList.add('item-price');

    let removeBtn = document.createElement('button')
    removeBtn.innerText = 'X';
    removeBtn.classList.add('item-remove')
    removeBtn.addEventListener('click',(e)=>{
        let row = e.target.parentElement.parentElement
        row.remove();
        updateTotal();
    })

    let itemPrice = document.createElement('p')
    itemPrice.innerText = `${price}$`;

    priceContainer.append(removeBtn,itemPrice);

    itemContainer.append(itemInfo,priceContainer);

    cartBody.append(itemContainer);
}

function updateTotal () {
    let total = 0;
    let itemsQty = document.querySelectorAll('.qty');

    itemsQty.forEach(item=>{
        let qty = Number(item.value);
        let price = (item.parentElement.parentElement.parentElement
        .querySelector('.item-price p').innerText).replace('$','');
        
        let itemValue = qty * Number(price);

        total += itemValue
    })
    total = Math.round(total * 100) / 100;
    document.getElementById('total-display').innerText = `${total}$`;
}