const pets = [
  { nome: "Gin", idade: 4, cidade: "São Paulo", estado: "SP", img: "dog.jpg" },
  {
    nome: "Luna",
    idade: 2,
    cidade: "Rio de Janeiro",
    estado: "RJ",
    img: "dog.jpg",
  },
  { nome: "Thor", idade: 3, cidade: "Curitiba", estado: "PR", img: "dog.jpg" },
];

const grid = document.querySelector(".grid");

pets.forEach((pet) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${pet.img}" alt="${pet.nome}">
    <h4>${pet.nome}</h4>
    <p>${pet.cidade} - ${pet.estado} | ${pet.idade} anos</p>
    <button class="btn-adopt">Eu quero</button>
  `;
  grid.appendChild(card);
});
