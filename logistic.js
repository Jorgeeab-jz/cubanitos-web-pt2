const logistic = (function(){
    const addDot = (n) => n.toString().replace(/B(?=(d{3})+(?!d))/g, ",");


    return {
        addDot
    }
})();