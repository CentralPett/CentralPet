const container = document.getElementById('adocao_pets');
const scrollAmount = 460;
const intervalTime = 3000;

let scrollPosition = 0;
let maxScrollLeft = container.scrollWidth - container.clientWidth;

function autoScroll(){
    scrollPosition += scrollAmount;

    if(scrollPosition > maxScrollLeft){
        scrollPosition = 0;
    }

    container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });

}

const autoScrollInterval = setInterval(autoScroll, intervalTime);

const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight')

const scrollAmount_2 = 460;

btnLeft.addEventListener('click', () => {

    container.scrollBy({
        left: -scrollAmount_2,
        behavior: 'smooth'
    })

})

btnRight.addEventListener('click', () => {

    container.scrollBy({
        left: scrollAmount_2,
        behavior: 'smooth'
    })

})