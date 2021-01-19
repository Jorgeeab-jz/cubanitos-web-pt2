const logistic = (function(){
    let currentOrder = {};
    const fbDb =  firebase.database();
    const logInfo = fbDb.ref().child('LOGISTICA');
    const openSign = document.querySelector('.open-sign');
    const closedSign = document.querySelector('.closed-sign');
    let info;
    
    const turnSign = () =>{
        let today = new Date
        console.log(today.getDay(),today.getHours())
        if(info.abierto.status == 'si' || ((today.getHours() > 7 
        && today.getHours() < 17) && (today.getDay() > 0))){
            openSign.style.display = 'block';
            closedSign.style.display = 'none';
            return true;
        }else if(info.abierto.status !== 'si'){
            closedSign.style.display = 'block';
            openSign.style.display = 'none';
            return false;
        }else{
            closedSign.style.display = 'block';
            openSign.style.display = 'none';
            return false;
        }

    }

    const _setDelivInfo = ()=>{
        let note = document.getElementById('del-note');
        let delPrice = document.getElementById('delivery-price');
        
        del.dataset.price = info.delivery.price;
        del.dataset.min = info.delivery.min;

        note.innerText +=`${addDot(info.delivery.min)}.BSS`;
        delPrice.innerText += `${addDot(info.delivery.price)}.BSS`;
    }
    
    logInfo.on('value',snap=>{
        let del = document.getElementById('delivery')

        info = snap.val()
        console.log(snap.val());
        turnSign();
        _setDelivInfo()
        console.log(info,'log')
            
    })
    
    const addDot = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const appendExtra = () => {
        let newBtn = this.cloneNode(true);
        item.append(newBtn);
    }
    
    
    return {
        addDot,
        appendExtra,
        turnSign,
        info
    }

})();
