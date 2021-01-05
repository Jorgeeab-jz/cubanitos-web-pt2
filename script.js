const category = document.querySelector('.category');
const modal = document.getElementById('modal');

category.addEventListener('click', ()=> {
    modal.style.display = 'block';
})

document.addEventListener('click', (e)=> {
    if(e.target == modal) {
        modal.style.display = 'none';
    }
})