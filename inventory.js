
const firebaseConfig = {
    apiKey: "AIzaSyBhEEjKEDyuJQ0fXY0R3VyMvssNEffLaMI",
    authDomain: "dulces-vicky.firebaseapp.com",
    databaseURL: "https://dulces-vicky-default-rtdb.firebaseio.com",
    projectId: "dulces-vicky",
    storageBucket: "dulces-vicky.appspot.com",
    messagingSenderId: "877270025588",
    appId: "1:877270025588:web:f8ad1aab9cfb9106935821",
    measurementId: "G-TE0KQKQ16F"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();


const inventory = (function () {
    const addContainer = document.getElementById('add-list');
    const cakeList = document.getElementById('cake-list');
    const coldList = document.getElementById('cold-list');
    const cookieList = document.getElementById('cookie-list');
    const comboList = document.getElementById('combo-list');

    /*
    const sandwichList = document.getElementById('sandwich-list');
    const maxList = document.getElementById('combo-max-list');
    const extraList = document.getElementById('extra-list');
    const drinkList = document.getElementById('bebida-list');
    const shakeList = document.getElementById('batidos');
    const merenList = document.getElementById('merengadas');
    const hotList = document.getElementById('calientes');
    */
    const _vickysDB = firebase.database();
    const _productos = _vickysDB.ref().child('PRODUCTOS');
    let _cakes;
    let _cold;
    let _cookie;
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

    const _showMenu = () => {
        const menu = document.getElementById('accordionMenu');
        const loading = document.getElementById('loading');
        const title = document.querySelector('.menu-title');

        title.style.display = 'block';
        loading.style.display = 'none';
        menu.style.display = 'block';
    }

    const checkOnline = () => {

        if (!navigator.onLine) {
            location.reload();
        }

    }

    const _drawProducts = (list, category, cartPrf, addList) => {

        for (const [key, value] of Object.entries(list)) {
            category.append(_generateCard(value, cartPrf, addList));
        }
    };

    const _clearNote = () => {
        document.getElementById('cook-message').value = '';
    }

    const _solidPreCart = () => {
        _clearNote();
        let extras = document.createElement('details');
        let extrasTitle = document.createElement('summary');
        extras.setAttribute('id', 'solid');
        extras.classList.add('extra-section');
        extrasTitle.innerText = 'Extras';

        extras.append(extrasTitle);

        let sauce = document.createElement('details');
        let sauceTitle = document.createElement('summary');
        sauce.setAttribute('id', 'sauce');
        sauce.classList.add('extra-section');
        sauceTitle.innerText = 'Salsas';

        sauce.append(sauceTitle);

        addContainer.append(extras, sauce);

    };

    const _drinksPreCart = () => {
        let extras = document.createElement('div');
        let extrasTitle = document.createElement('h2');
        extras.setAttribute('id', 'drink');
        extras.classList.add('extra-section');
        extrasTitle.innerText = 'Extras';

        extras.append(extrasTitle);
        addContainer.append(extras);
    }

    /*
    const _getAdds = () => {
        _productos.child('ADICIONALES')
            .child('PLATOS').on('value', snap => {
                _addDish = snap.val();
            })
        _productos.child('ADICIONALES')
            .child('SALSAS').on('value', snap => {
                _addSauce = snap.val();
            })

        _productos.child('ADICIONALES')
            .child('BEBIDAS').on('value', snap => {
                _addDrinks = snap.val();
            })
    };
    */

    const _generateAdd = (item) => {
        let container = document.createElement('li');
        container.classList.add('extra-item');
        container.dataset.price = item.price;

        let name = document.createElement('p');
        name.innerText = item.name

        let priceContainer = document.createElement('div');
        priceContainer.classList.add('add-price');
        let price = document.createElement('span');
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
        qtyInput.setAttribute('type', 'checkbox');
        qtyInput.addEventListener('change', _getTotalCost);

        itemInput.append(qtyInput);

        container.append(name, priceContainer, itemInput);

        return container;
    };


    const _drawExtra = (items, list) => {
        for (const [key, value] of Object.entries(items)) {
            if (value.disp == 'si') {
                list.append(_generateAdd(value))
            } else {
                continue;
            }
        }
    };


    const _setPreCartItem = (item) => {
        let itemName = `${item.dataset.prefix} ${item.dataset.name}`;

        let orderTitle = document.getElementById('current-item-name');

        orderTitle.innerText = itemName;
        orderTitle.dataset.price = item.dataset.price;
    };

    const _getTotalCost = () => {
        let total = 0;
        let currentItem = document.getElementById('current-item-name');
        let currentCost = Number(currentItem.dataset.price);
        total += currentCost;

        let extras = document.querySelectorAll('.extra-input input');

        extras.forEach(extra => {
            if (extra.checked) {
                total += Number(extra.dataset.price);
            }
        })
        total = Math.round(total * 100) / 100;
        let totalDisplay = document.getElementById('pre-cart-total');
        totalDisplay.dataset.price = total;
        totalDisplay.innerText = `${logistic.addDot(total)}.$`
    }

    const switchPreCart = (item) => {

        if (item.dataset.addList == 'solid') {
            addContainer.innerHTML = '';
            _solidPreCart();
            let solidList = document.getElementById('solid');
            let sauceList = document.getElementById('sauce');

            //_drawExtra(_addDish, solidList);
            //_drawExtra(_addSauce, sauceList);
        } else if (item.dataset.addList == 'drink') {
            addContainer.innerHTML = ''
            _drinksPreCart();
            let extraList = document.getElementById('drink');

            //_drawExtra(_addDrinks, extraList);
        } else {
            addContainer.innerHTML = '';
        }
    };

    const _getList = () => {
        cakeList.innerHTML = '';
        _productos.child('TORTAS')
            .on('value', snap => {
                _cakes = snap.val();
                _drawProducts(_cakes, cakeList, 'Torta', 'solid');
            })

        coldList.innerHTML = '';
        _productos.child('FRIOS')
            .on('value', snap => {
                _cold = snap.val();
                _drawProducts(_cold, coldList, '', 'solid');
            })

        cookieList.innerHTML = '';
        _productos.child('GALLETAS')
            .on('value', snap => {
                _cookie = snap.val();
                _drawProducts(_cookie, cookieList, 'Galleta', 'solid');
            })
        /*
        comboList.innerHTML = '';
        _productos.child('COMBOS')
            .on('value', snap => {
                _combo = snap.val();
                _drawProducts(_combo, comboList, 'Combo', 'solid');
            })

        maxList.innerHTML = '';
        _productos.child('COMBOSMAX')
            .on('value', snap => {
                _maxi = snap.val();
                _drawProducts(_maxi, maxList, 'Combo',);
            })

        extraList.innerHTML = '';
        _productos.child('EXTRAS')
            .on('value', snap => {
                _extras = snap.val();
                _drawProducts(_extras, extraList, '');
            })
        _productos.child('POSTRES')
            .on('value', snap => {
                _dessert = snap.val();
                _drawProducts(_dessert, extraList, '');
            })

        drinkList.innerHTML = '';
        _productos.child('BEBIDAS').child('frias')
            .on('value', snap => {
                _drinks = snap.val();
                _drawProducts(_drinks, drinkList, '');
            })

        shakeList.innerHTML = '';
        _productos.child('BEBIDAS').child('batidos')
            .on('value', snap => {
                _shakes = snap.val();
                _drawProducts(_shakes, shakeList, 'Batido', 'drink');
            })

        merenList.innerHTML = '';
        _productos.child('BEBIDAS').child('merengadas')
            .on('value', snap => {
                _meren = snap.val();
                _drawProducts(_meren, merenList, 'Merengada');
            })

        hotList.innerHTML = '';
        _productos.child('BEBIDAS').child('calientes')
            .on('value', snap => {
                _hotD = snap.val();
                _drawProducts(_hotD, hotList, '');
            })
        */
    };

    const _generateCard = (item, prf, addList) => {
        let container = document.createElement('div')
        container.classList.add('col');

        let card = document.createElement('div')
        card.classList.add('card')
        card.classList.add('shadow-sm');

        let carousel = document.createElement('div');
        carousel.setAttribute('id', `carousel${prf + item.name}control`)
        carousel.classList.add('carousel')
        carousel.classList.add('slide');
        carousel.dataset.bsRide = 'carousel';
        carousel.dataset.bsPause = 'false';

        let innerCar = document.createElement('div');
        innerCar.classList.add('carousel-inner');

        if ((typeof item.img) == 'string') {
            let imageContainer = document.createElement('div');
            imageContainer.classList.add('carousel-item')
            imageContainer.classList.add('active');

            let image = document.createElement('img');
            image.src = item.img;
            imageContainer.append(image);
            innerCar.append(imageContainer);
        } else if ((typeof item.img) == 'object') {
            let indicateCont = document.createElement('ol');
            indicateCont.classList.add('carousel-indicators');
            for (let i in item.img) {

                let indLi = document.createElement('li');
                indLi.dataset.bsTarget = `carousel${prf + item.name}control`;
                indLi.dataset.bsSlideTo = i;

                let imageContainer = document.createElement('div');
                imageContainer.classList.add('carousel-item');

                let image = document.createElement('img');
                image.classList.add('d-block');
                image.classList.add('w-100');
                image.src = item.img[i];
                imageContainer.append(image);

                if (i == 0) {
                    imageContainer.classList.add('active');
                    indLi.classList.add('active');
                }

                indicateCont.append(indLi);
                carousel.append(indicateCont);

                innerCar.append(imageContainer);

                let prevCont = document.createElement('a');
                prevCont.classList.add('carousel-control-prev');
                prevCont.href = `#carousel${(prf + item.name).replace(/\s/g, '')}control`;
                prevCont.setAttribute('role', 'button');
                prevCont.dataset.bsSlide = 'prev';
                let prevIcon = document.createElement('span');
                prevIcon.classList.add('carousel-control-prev-icon');
                prevIcon.setAttribute('aria-hidden', 'true');
                let prevHid = document.createElement('span');
                prevHid.classList.add('visually-hidden');
                prevHid.innerText = 'Anterior';
                prevCont.append(prevIcon, prevHid);

                let nextCont = document.createElement('a');
                nextCont.classList.add('carousel-control-next');
                nextCont.href = `#carousel${prf + item.name}control`;
                nextCont.setAttribute('role', 'button');
                nextCont.dataset.bsSlide = 'next';
                let nextIcon = document.createElement('span');
                nextIcon.classList.add('carousel-control-next-icon');
                nextIcon.setAttribute('aria-hidden', 'true');
                let nextHid = document.createElement('span');
                nextHid.classList.add('visually-hidden');
                nextHid.innerText = 'Siguiente';
                nextCont.append(nextIcon, nextHid);

                innerCar.append(prevCont, nextCont);
            }
        } else {
            let imageContainer = document.createElement('div');
            imageContainer.classList.add('carousel-item')
            imageContainer.classList.add('active');

            let image = document.createElement('img');
            image.src = 'placeholder.png';
            imageContainer.append(image);
            innerCar.append(imageContainer);
        }

        carousel.append(innerCar);

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
        addBtn.addEventListener('click', (e) => {
            let thisBtn = e.target.closest('button')
            if (logistic.turnSign()) {
                checkOnline();
                _clearNote();
                _setPreCartItem(thisBtn);
                switchPreCart(thisBtn);
                _getTotalCost();
                //cart.extraModal.toggle();
                cart.AddItemToCart();
                //cart.extraModal.toggle();
            } else {
                alert('Estamos cerrados.');
            }

        })

        let price = document.createElement('small')
        price.innerText = `${logistic.addDot(item.price)} $`
        price.classList.add('text-muted');


        body.append(title, info, price, addBtn);
        card.append(carousel, body);
        container.append(card);

        return container;
    };

    const drawMenu = () => {
        _productos.on('value', snap => {
            _productCheck = snap.val();
            _getList()
            //_getAdds()
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
