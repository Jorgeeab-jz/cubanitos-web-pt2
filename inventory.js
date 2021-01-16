
const firebaseConfig = {
    apiKey: "AIzaSyBGi2Dms5vCM5acyFHYmB-MdR9LeXKUkzE",
    authDomain: "los-cubanitos-2010.firebaseapp.com",
    databaseURL: "https://los-cubanitos-2010-default-rtdb.firebaseio.com",
    projectId: "los-cubanitos-2010",
    storageBucket: "los-cubanitos-2010.appspot.com",
    messagingSenderId: "49959430723",
    appId: "1:49959430723:web:1b1573719efc87828442f6",
    measurementId: "G-YVJCMKTJLV"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();


const inventory = (function(){
    const addContainer = document.getElementById('add-list');
    const preCart = document.getElementById('pre-cart');
    const burgerList = document.getElementById('burger-list');
    const sandwichList = document.getElementById('sandwich-list');
    const comboList = document.getElementById('combo-list');
    const extraList = document.getElementById('extra-list');
    const drinkList = document.getElementById('bebida-list');
    const _cubanitosDB = firebase.database();
    const _productos = _cubanitosDB.ref().child('PRODUCTOS');
    let _burgers;
    let _sandwich;
    let _combo;
    let _extras;
    let _dessert;
    let _drinks;
    let _addDish;
    let _addSauce;

    const _drawProducts = (list,category,cartPrf,addList)=>{
        for (const [key,value] of Object.entries(list)) {
            if(value.disp == "si"){
                category.append(_generateCard(value,cartPrf,addList));
            }else{
                continue;
            }
        }
    };

    const _clearNote = ()=>{
        document.getElementById('cook-message').value= '';
    }

    const _solidPreCart = ()=>{
        _clearNote();
        let extras = document.createElement('div');
        let extrasTitle = document.createElement('h4');
        extras.setAttribute('id','solid');
        extras.classList.add('extra-section');
        extrasTitle.innerText = 'Extras';

        extras.append(extrasTitle);
        
        let sauce = document.createElement('div');
        let sauceTitle = document.createElement('h4');
        sauce.setAttribute('id','sauce');
        sauce.classList.add('extra-section');
        sauceTitle.innerText = 'Salsas';

        sauce.append(sauceTitle);

        addContainer.append(extras,sauce);
        
    };

    const _getAdds = ()=>{
        _productos.child('ADICIONALES')
        .child('PLATOS').once('value',snap=>{
            _addDish = snap.val();
            console.log(_addDish);
        })
        _productos.child('ADICIONALES')
        .child('SALSAS').once('value',snap=>{
            _addSauce = snap.val();
            console.log(_addSauce);
        })
    };

    const _generateAdd = (item) => {
        let container = document.createElement('div');
        container.classList.add('extra-item');
        container.dataset.price = item.price;

        let name = document.createElement('p');
        name.innerText = item.name

        let price = document.createElement ('span');
        price.innerText = `+${logistic.addDot(item.price)}.BSS`;
        let itemInput = document.createElement('div')
        itemInput.classList.add('form-check');
        itemInput.classList.add('extra-input')
        let qtyInput = document.createElement('input')
        qtyInput.value = '';
        qtyInput.dataset.name = item.name
        qtyInput.dataset.color = item.color;
        qtyInput.dataset.price = item.price;
        qtyInput.setAttribute('type','checkbox');
        qtyInput.addEventListener('change', _getTotalCost);

        itemInput.append(qtyInput);

        container.append(name,price,itemInput);

        return container;
    };

    const _drawExtra = (items,list)=>{
        for (const [key,value] of Object.entries(items)) {
            if(value.disp == 'si'){
                list.append(_generateAdd(value))
            }else{
                continue;
            }
        }
    };

    const _setPreCartItem = (item)=>{
        let itemName = `${item.dataset.prefix} ${item.dataset.name}`;

        let orderTitle = document.getElementById('current-item-name');
        
        orderTitle.innerText = itemName;
        orderTitle.dataset.price = item.dataset.price;
    };

    const _getTotalCost = ()=>{
        let total = 0;
        let currentItem = document.getElementById('current-item-name');
        let currentCost = Number(currentItem.dataset.price);
        total += currentCost;

        let extras = document.querySelectorAll('.extra-input input');

        extras.forEach(extra=>{
            if(extra.checked){
                total += Number(extra.dataset.price);
            }
        })
        total = Math.round(total * 100) / 100;
        let totalDisplay = document.getElementById('pre-cart-total');
        totalDisplay.dataset.price = total;
        totalDisplay.innerText = `${logistic.addDot(total)}.BSS`
    }

    const switchPreCart = (item)=>{
       
        if(item.dataset.addList == 'solid') {
            addContainer.innerHTML = '';
            _solidPreCart();
            let solidList = document.getElementById('solid');
            let sauceList = document.getElementById('sauce');
        
            _drawExtra(_addDish,solidList);
            _drawExtra(_addSauce,sauceList);
        }else{
            addContainer.innerHTML = 'adadd'
        }
    };

    const _getList = ()=>{
        _productos.child('HAMBURGUESAS')
        .once('value', snap=>{
            _burgers = snap.val();
            _drawProducts(_burgers,burgerList,'Hamburguesa','solid');
        })
        _productos.child('SANDWICHES')
        .once('value', snap=>{
            _sandwich = snap.val();
            _drawProducts(_sandwich,sandwichList,'Sandwich','solid');
        })
        _productos.child('COMBOS')
        .once('value', snap=>{
            _combo = snap.val();
            _drawProducts(_combo,comboList,'Combo');
        })
        _productos.child('EXTRAS')
        .once('value', snap=>{
            _extras = snap.val();
            _drawProducts(_extras,extraList,'');
        })
        _productos.child('POSTRES')
        .once('value', snap=>{
            _dessert = snap.val();
            _drawProducts(_dessert,extraList,'');
        })
    };

    const _generateCard = (item,prf,addList)=>{
        let container = document.createElement('div')
        container.classList.add('col');
        
        let card = document.createElement('div')
        card.classList.add('card')
        card.classList.add('shadow-sm');
        
        let image = document.createElement('img')
        image.classList.add('card-img-top')
        if (item.img == undefined){
            image.setAttribute('src', 'placeholder.png');
        }else{
            image.setAttribute('src', item.img);
        }
        
        let body = document.createElement('div')
        body.classList.add('card-body');
    
        let title = document.createElement('h2')
        title.classList.add('item-title')
        title.innerText = item.name;
    
        let info = document.createElement('p')
        info.classList.add('card-text')
        info.innerText = item.description;
    
        let addBtn = document.createElement('button')
        addBtn.classList.add('add-btn')
        addBtn.innerText = 'Añadir al carrito'
        addBtn.dataset.prefix = prf; 
        addBtn.dataset.price = item.price;
        addBtn.dataset.name = item.name;
        addBtn.dataset.addList = addList;
        addBtn.addEventListener('click', (e)=>{
            let thisBtn = e.target
            console.log((e.target).dataset.price, (e.target).dataset.name)
            let itemName = `${thisBtn.dataset.prefix} ${thisBtn.dataset.name}`;
            _clearNote();
            _setPreCartItem(thisBtn);
            switchPreCart(thisBtn);
            _getTotalCost();
            cart.extraModal.toggle();
            document.getElementById('add-cart-modal').style.display = 'block';
        })
    
        let price = document.createElement('small')
        price.innerText = `${logistic.addDot(item.price)}.Bss`
        price.classList.add('text-muted');
    
    
        body.append(title,info,addBtn,price);
        card.append(image,body);
        container.append(card);
    
        return container;
    };

    const drawMenu = ()=>{
        _productos.once('value')
        .then(snap=>{
            _getList()
            _getAdds()
        }).catch(console.log('Error'))
    };

    return {
        drawMenu,
    }

})();

inventory.drawMenu();
