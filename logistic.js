const logistic = (function(){
    let currentOrder = {};



    const addDot = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const appendExtra = () => {
        let newBtn = this.cloneNode(true);
        item.append(newBtn);
    }
    
    
    
    return {
        addDot,
        appendExtra
    }

})();
