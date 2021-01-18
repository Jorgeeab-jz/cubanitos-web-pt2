const logistic = (function(){
    let currentOrder = {};
    const fbDb =  firebase.database();
    const logInfo = fbDb.ref().child('LOGISTICA');
    const openSign = document.querySelector('.open-sign');
    const closedSign = document.querySelector('.closed-sign');
    let info;
    
    const turnSign = () =>{
        if(info.abierto.status == 'si'){
            openSign.style.display = 'block';
            closedSign.style.display = 'none';
            return true;
        }else{
            closedSign.style.display = 'block';
            openSign.style.display = 'none';
            return false;
        }

    }
    logInfo.on('value',snap=>{
        info = snap.val()
        console.log(snap.val());
        turnSign()
    })
    
    
    const addDot = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const appendExtra = () => {
        let newBtn = this.cloneNode(true);
        item.append(newBtn);
    }
    
    
    return {
        addDot,
        appendExtra,
        turnSign
    }

})();


