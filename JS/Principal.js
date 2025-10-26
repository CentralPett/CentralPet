const container = document.getElementById("adocao_pets");
const scrollAmount = 460;
const intervalTime = 3000;

let scrollPosition = 0;
let maxScrollLeft = container.scrollWidth - container.clientWidth;

function autoScroll() {
  scrollPosition += scrollAmount;

  if (scrollPosition > maxScrollLeft) {
    scrollPosition = 0;
  }

  container.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });
}

setInterval(autoScroll, intervalTime);

const container_card = document.querySelector(".carrosel_geral_container"); // CORRIGIDO
const intervalTime_card = 3000;

let scrollPosition_card = 0;
let maxScrollLeft_card =
  container_card.scrollWidth - container_card.clientWidth;

function getScrollAmount() {
  const card = container_card.querySelector(".carrosel_geral_item");
  if (!card) return container_card.clientWidth;

  const style = getComputedStyle(card);
  const marginRight = parseInt(style.marginRight) || 0;
  const marginLeft = parseInt(style.marginLeft) || 0;

  return card.offsetWidth + marginLeft + marginRight;
}

function autoScroll_card() {
  maxScrollLeft_card = container_card.scrollWidth - container_card.clientWidth;

  scrollPosition_card += getScrollAmount();

  if (scrollPosition_card > maxScrollLeft_card) {
    scrollPosition_card = 0;
  }

  container_card.scrollTo({
    left: scrollPosition_card,
    behavior: "smooth",
  });
}

const autoScrollInterval = setInterval(autoScroll_card, intervalTime_card);

const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");

btnLeft.addEventListener("click", () => {
  container_card.scrollBy({
    left: -getScrollAmount(),
    behavior: "smooth",
  });
});

btnRight.addEventListener("click", () => {
  container_card.scrollBy({
    left: getScrollAmount(),
    behavior: "smooth",
  });
});

const botao = document.getElementById("botao-form");

botao.addEventListener("click", function () {
  alert("Sua mensagem foi enviada!");
});
