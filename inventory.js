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
    let _drinks;

    const _drawProducts = (list,category)=>{
        for (const [key,value] of Object.entries(list)) {
            category.append(generateCard(value));
        }
    }

    const _getList = ()=>{
        _productos.child('HAMBURGUESAS')
        .once('value', snap=>{
            _burgers = snap.val();
            _drawProducts(_burgers,burgerList);
        })
        _productos.child('SANDWICHES')
        .once('value', snap=>{
            _sandwich = snap.val();
            _drawProducts(_sandwich,sandwichList);
        })
    }

    const generateCard = (item)=>{
        let container = document.createElement('div')
        container.classList.add('col');
        
        let card = document.createElement('div')
        card.classList.add('card')
        card.classList.add('shadow-sm');
        
        let image = document.createElement('img')
        image.classList.add('card-img-top')
        image.setAttribute('src', item.img);
    
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
        addBtn.dataset.price = item.price
        addBtn.dataset.name = item.name;
        addBtn.addEventListener('click', (e)=>{
            console.log((e.target).dataset.price, (e.target).dataset.name)
        })
    
        let price = document.createElement('small')
        price.innerText = `${item.price}$`
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