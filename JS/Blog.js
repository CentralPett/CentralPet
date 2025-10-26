
const container_blog = document.getElementById('carrosel');
const intervalTime_blog = 3600;

let scrollPosition_blog = 0;
let maxScrollLeft_blog = container_blog.scrollWidth - container_blog.clientWidth;

    function getScrollAmount(){
    const card = container_blog.querySelector('.card');
    if (!card) return container_blog.clientWidth;

    const style = getComputedStyle(card);
    const marginright = parseInt(style.marginright)  || 0;
    const marginleft = parseInt(style.marginleft)  || 0;

    return card.offsetWidth + marginleft + marginright;
}

function autoScroll(){

    maxScrollLeft_blog = container_blog.scrollWidth - container_blog.clientWidth;

    scrollPosition_blog += getScrollAmount();

    if(scrollPosition_blog > maxScrollLeft_blog){
        scrollPosition_blog = 0;
    }

    container_blog.scrollTo({
        left: scrollPosition_blog,
        behavior: 'smooth'
    })
}


setInterval(autoScroll, intervalTime_blog);

const left = document.getElementById('left');
const right = document.getElementById('right');


left.addEventListener('click', () => {
    scrollPosition_blog -= getScrollAmount();
    if(scrollPosition_blog < 0) scrollPosition_blog =0;

    container_blog.scrollTo({
        left: scrollPosition_blog,
        behavior: 'smooth'
    })

})

right.addEventListener('click', () => {

    scrollPosition_blog += getScrollAmount();
    const maxScroll = container_blog.scrollWidth - container_blog.clientWidth;
    if(scrollPosition_blog > maxScroll) scrollPosition_blog = maxScroll;

    container_blog.scrollTo({
        left: scrollPosition_blog,
        behavior: 'smooth'
    })

})

const hamburguer = document.querySelector(".hamburguer");
const nav = document.getElementById("barra-navegacao");

hamburguer.addEventListener("click", () => {
  nav.classList.toggle("active");
});