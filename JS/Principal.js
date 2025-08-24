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

setInterval(autoScroll, intervalTime);



const container_card = document.querySelector('.carrosel_geral_container'); // CORRIGIDO
const scrollAmount_card = 1960;
const intervalTime_card = 3000;

let scrollPosition_card = 0;
let maxScrollLeft_card = container_card.scrollWidth - container_card.clientWidth;

function autoScroll_card(){
    scrollPosition_card += scrollAmount_card;

    if(scrollPosition_card > maxScrollLeft_card){
        scrollPosition_card = 0;
    }

    container_card.scrollTo({
        left: scrollPosition_card,
        behavior: 'smooth'
    });
}

const autoScrollInterval = setInterval(autoScroll_card, intervalTime_card);

const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');

btnLeft.addEventListener('click', () => {
    container_card.scrollBy({
        left: -scrollAmount_card,
        behavior: 'smooth'
    });
});

btnRight.addEventListener('click', () => {
    container_card.scrollBy({
        left: scrollAmount_card,
        behavior: 'smooth'
    });
});