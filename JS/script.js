// Seleziona gli elementi HTML
const lidClosed = document.getElementById('lidClosed');
const lidOpen = document.getElementById('lidOpen');
const trapezoidBorder = document.getElementById('trapezoidLidBorder');
const trapezoidLid = document.getElementById('trapezoidLid');
const display = document.getElementById('display'); // Manteniamo il display
const quoteScreen = document.getElementById('quoteScreen');
const blackButton1 = document.getElementById('one');
const blackButton2 = document.getElementById('two');

// Crea e aggiungi dinamicamente il greenRectangle e i pulsanti + e -
const verticalR = document.getElementById('verticalR');

// Crea il greenRectangle
const greenRectangle = document.createElement('div');
greenRectangle.id = 'greenRectangle';
document.getElementById('pokedex').appendChild(greenRectangle);

// Crea i pulsanti + e - e aggiungili a verticalR
const nextButton = document.createElement('button');
nextButton.classList.add('padbtn', 'btn1');
nextButton.textContent = '+';
const prevButton = document.createElement('button');
prevButton.classList.add('padbtn', 'btn2');
prevButton.textContent = '-';
verticalR.appendChild(nextButton);
verticalR.appendChild(prevButton);

let currentPokemonId = null; // Inizializza a null per partire con schermo nero

// Funzione per ottenere i dati del Pokémon
async function fetchPokemonData(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

// Funzione per aggiornare il display
function updateDisplay(data) {
  if (!data) {
    display.innerHTML = ''; // Display vuoto quando non ci sono dati
    greenRectangle.textContent = '';
    quoteScreen.innerHTML = '';
    blackButton1.textContent = '';
    blackButton2.textContent = '';
  } else {
    display.innerHTML = `<img src="${data.sprites.front_default}" alt="${data.name}">`;
    greenRectangle.textContent = `#${data.id}`;

    // Gestione dei tipi di Pokémon
    const types = data.types.map(typeInfo => typeInfo.type.name);
    blackButton1.textContent = types[0] || '';
    blackButton2.textContent = types[1] || '';
    blackButton2.style.display = types[1] ? 'block' : 'none'; // Nascondi il secondo pulsante se non c'è un secondo tipo

    quoteScreen.innerHTML = `
      <p>Name: ${data.name}</p>
      <p>Height: ${data.height}</p>
      <p>Weight: ${data.weight}</p>
      <p>Base Experience: ${data.base_experience}</p>
    `;
  }
}

// Funzione per aggiornare il Pokémon mostrato
async function updatePokemon(id) {
  if (!id) {
    updateDisplay(null); // Mostra schermo nero se id è null
    return;
  }
  
  const data = await fetchPokemonData(id);
  updateDisplay(data);
}

// Event listener per la chiusura del coperchio
lidClosed.addEventListener('transitionend', event => {
  trapezoidBorder.setAttribute('style', 'visibility: hidden');
  trapezoidLid.setAttribute('style', 'visibility:hidden');
  lidClosed.setAttribute('style', 'visibility: hidden');
  lidOpen.setAttribute('style', 'visibility:visible');
  updatePokemon(currentPokemonId); // Aggiorna il display quando il coperchio si apre
});

// Event listener per il pulsante "next"
nextButton.addEventListener('click', () => {
  if (currentPokemonId === null || currentPokemonId < 1010) {
    currentPokemonId = currentPokemonId ? currentPokemonId + 1 : 1; // Parti da 1 se è null
    updatePokemon(currentPokemonId);
  } else {
    currentPokemonId = 1; // Torna al primo Pokémon se si raggiunge il limite
    updatePokemon(currentPokemonId);
  }
});

// Event listener per il pulsante "previous"
prevButton.addEventListener('click', () => {
  if (currentPokemonId === null || currentPokemonId > 1) {
    currentPokemonId = currentPokemonId ? currentPokemonId - 1 : 1010; // Parti da 1010 se è null
    updatePokemon(currentPokemonId);
  } else {
    currentPokemonId = 1010; // Vai all'ultimo Pokémon se si è al primo
    updatePokemon(currentPokemonId);
  }
});

// Inizializza il display vuoto
updatePokemon(null); // Avvia con schermo nero