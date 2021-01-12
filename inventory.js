const burgerList = document.getElementById('burger-list');
const sandwichList = document.getElementById('sandwich-list');
const comboList = document.getElementById('combo-list');
const extraList = document.getElementById('extra-list');
const drinkList = document.getElementById('bebida-list');

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
    const _cubanitosDB = firebase.database();
    const _productos = _cubanitosDB.ref().child('PRODUCTOS');
    let _burgers;
    let _sandwich;
    let _combo;
    let _extras;
    let _dessert;
    let _drinks;

    const _drawProducts = (list,category,cartPrf)=>{
        for (const [key,value] of Object.entries(list)) {
            if(value.disp){
                category.append(generateCard(value,cartPrf));
            }else{
                continue;
            }
        }
    }

    const _getList = ()=>{
        _productos.child('HAMBURGUESAS')
        .once('value', snap=>{
            _burgers = snap.val();
            _drawProducts(_burgers,burgerList,'Hamburguesa');
        })
        _productos.child('SANDWICHES')
        .once('value', snap=>{
            _sandwich = snap.val();
            _drawProducts(_sandwich,sandwichList,'Sandwich');
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

    const generateCard = (item,prf)=>{
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
        addBtn.addEventListener('click', (e)=>{
            console.log((e.target).dataset.price, (e.target).dataset.name)
            let items = document.querySelectorAll('.item-name');
            let itemsArr = [...items];
            let itemName = `${e.target.dataset.prefix} ${e.target.dataset.name}`;

            if (itemsArr.some(i => i.innerText == itemName)){
                alertModal.toggle();
                return
            }else{
                generateCartItem(itemName,((e.target).dataset.price))
                animateCSS('.cart-btn-container', 'swing');
                updateTotal();
                updateCartIcon()
            }
            
        })
    
        let price = document.createElement('small')
        price.innerText = `${item.price}.Bss`
        price.classList.add('text-muted');
    
    
        body.append(title,info,addBtn,price);
        card.append(image,body);
        container.append(card);
    
        return container;
    }

    const drawMenu = ()=>{
        _productos.once('value')
        .then(snap=>{
            _getList()
        }).catch(console.log('Error'))
    };

    return {
        drawMenu
    }

})();

inventory.drawMenu();