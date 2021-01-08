const burgerList = document.getElementById('burger-list');
const sandwichList = document.getElementById('sandwich-list');
const comboList = document.getElementById('combo-list');
const extraList = document.getElementById('extra-list');
const drinkList = document.getElementById('bebida-list');





productos.once('value')
.then(snap=>{
    getList();
}).catch(function (err) {
    console.log('Error', err.code);
});


function drawMenu(){
    drawProducts(burgers,burgerList);
    drawProducts(sandwich,sandwichList);
}