
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
    const burgerList = document.getElementById('burger-list');
    const sandwichList = document.getElementById('sandwich-list');
    const comboList = document.getElementById('combo-list');
    const maxList = document.getElementById('combo-max-list');
    const extraList = document.getElementById('extra-list');
    const drinkList = document.getElementById('bebida-list');
    const shakeList = document.getElementById('batidos');
    const merenList = document.getElementById('merengadas');
    const hotList = document.getElementById('calientes');
    const _cubanitosDB = firebase.database();
    const _productos = _cubanitosDB.ref().child('PRODUCTOS');
    let _burgers;
    let _sandwich;
    let _combo;
    let _maxi;
    let _extras;
    let _dessert;
    let _drinks;
    let _shakes;
    let _meren;
    let _hotD;
    let _addDish;
    let _addSauce;
    let _addDrinks;

    const _showMenu = ()=>{
        const menu = document.getElementById('accordionMenu');
        const loading = document.getElementById('loading');
        const title = document.querySelector('.menu-title');

        title.style.display = 'block';
        loading.style.display = 'none';
        menu.style.display = 'block';
    }

    const checkOnline = ()=>{
        
        if(!navigator.onLine){
            location.reload();
        }
        
    }

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
        let extras = document.createElement('details');
        let extrasTitle = document.createElement('summary');
        extras.setAttribute('id','solid');
        extras.classList.add('extra-section');
        extrasTitle.innerText = 'Extras';

        extras.append(extrasTitle);
        
        let sauce = document.createElement('details');
        let sauceTitle = document.createElement('summary');
        sauce.setAttribute('id','sauce');
        sauce.classList.add('extra-section');
        sauceTitle.innerText = 'Salsas';

        sauce.append(sauceTitle);

        addContainer.append(extras,sauce);
        
    };

    const _drinksPreCart = ()=>{
        let extras = document.createElement('div');
        let extrasTitle = document.createElement('h2');
        extras.setAttribute('id','drink');
        extras.classList.add('extra-section');
        extrasTitle.innerText = 'Extras';

        extras.append(extrasTitle);
        addContainer.append(extras);
    }

    const _getAdds = ()=>{
        _productos.child('ADICIONALES')
        .child('PLATOS').on('value',snap=>{
            _addDish = snap.val();
        })
        _productos.child('ADICIONALES')
        .child('SALSAS').on('value',snap=>{
            _addSauce = snap.val();
        })

        _productos.child('ADICIONALES')
        .child('BEBIDAS').on('value',snap=>{
            _addDrinks = snap.val();
        })
    };

    const _generateAdd = (item) => {
        let container = document.createElement('li');
        container.classList.add('extra-item');
        container.dataset.price = item.price;

        let name = document.createElement('p');
        name.innerText = item.name
        
        let priceContainer = document.createElement('div');
        priceContainer.classList.add('add-price');
        let price = document.createElement ('span');
        price.innerText = `+${logistic.addDot(item.price)}.BSS`;
        priceContainer.append(price);
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

        container.append(name,priceContainer,itemInput);

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
        }else if(item.dataset.addList == 'drink'){
            addContainer.innerHTML = ''
            _drinksPreCart();
            let extraList = document.getElementById('drink');

            _drawExtra(_addDrinks,extraList);
        }else{
            addContainer.innerHTML = '';
        }
    };

    const _getList = ()=>{
        burgerList.innerHTML = '';
        _productos.child('HAMBURGUESAS')
        .on('value', snap=>{
            _burgers = snap.val();
            _drawProducts(_burgers,burgerList,'Hamburguesa','solid');
        })

        sandwichList.innerHTML = '';
        _productos.child('SANDWICHES')
        .on('value', snap=>{
            _sandwich = snap.val();
            _drawProducts(_sandwich,sandwichList,'Sandwich','solid');
        })

        comboList.innerHTML = '';
        _productos.child('COMBOS')
        .on('value', snap=>{
            _combo = snap.val();
            _drawProducts(_combo,comboList,'Combo','solid');
        })

        maxList.innerHTML = '';
        _productos.child('COMBOSMAX')
        .on('value', snap=>{
            _maxi = snap.val();
            _drawProducts(_maxi,maxList,'Combo',);
        })

        extraList.innerHTML = '';
        _productos.child('EXTRAS')
        .on('value', snap=>{
            _extras = snap.val();
            _drawProducts(_extras,extraList,'');
        })
        _productos.child('POSTRES')
        .on('value', snap=>{
            _dessert = snap.val();
            _drawProducts(_dessert,extraList,'');
        })

        drinkList.innerHTML = '';
        _productos.child('BEBIDAS').child('frias')
        .on('value', snap=>{
            _drinks = snap.val();
            _drawProducts(_drinks,drinkList,'');
        })

        shakeList.innerHTML = '';
        _productos.child('BEBIDAS').child('batidos')
        .on('value', snap=>{
            _shakes = snap.val();
            _drawProducts(_shakes,shakeList,'Batido','drink');
        })

        merenList.innerHTML = '';
        _productos.child('BEBIDAS').child('merengadas')
        .on('value', snap=>{
            _meren = snap.val();
            _drawProducts(_meren,merenList,'Merengada');
        })

        hotList.innerHTML = '';
        _productos.child('BEBIDAS').child('calientes')
        .on('value', snap=>{
            _hotD = snap.val();
            _drawProducts(_hotD,hotList,'');
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
        addBtn.innerHTML = '<i class="fas fa-cart-plus"></i>';
        addBtn.dataset.prefix = prf; 
        addBtn.dataset.price = item.price;
        addBtn.dataset.name = item.name;
        addBtn.dataset.addList = addList;
        addBtn.addEventListener('click', (e)=>{
            let thisBtn = e.target.closest('button')
            if(logistic.turnSign()){
                checkOnline();
            _clearNote();
            _setPreCartItem(thisBtn);
            switchPreCart(thisBtn);
            _getTotalCost();
            cart.extraModal.toggle();
            }else{
                alert('Estamos cerrados.');
            }
            
        })
    
        let price = document.createElement('small')
        price.innerText = `${logistic.addDot(item.price)}.Bss`
        price.classList.add('text-muted');
    
    
        body.append(title,info,price,addBtn);
        card.append(image,body);
        container.append(card);
    
        return container;
    };

    const drawMenu = ()=>{
        _productos.on('value',snap=>{
            _productCheck = snap.val();
            _getList()
            _getAdds()
            animateCSS('.menu', 'backInDown');
            _showMenu();
        })

    };

    return {
        drawMenu,
        checkOnline
    }

})();

inventory.drawMenu();
window.oncontextmenu = (e)=>{
    e.preventDefault();
}