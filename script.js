const btnaddPoke = document.getElementById("addPoke");
btnaddPoke.addEventListener('click', afegirPoke);
const contador = document.getElementById("numPoke");
const pokeList = document.getElementById("pokeList");
const temp = document.getElementById("poke-template");
let numerosGenerados = []; 

let cartasGeneradas = [];

function afegirPoke() {
    pokeList.innerHTML = "";
    cartasGeneradas = [];

    while (contador.value > 0) {
        let randomNumber = Math.floor(Math.random() * 1017) + 1;
        let repeated = numerosGenerados.includes(randomNumber);

        if (!repeated) {
            numerosGenerados.push(randomNumber);

            fetch('https://pokeapi.co/api/v2/pokemon/' + randomNumber)
                .then(response => response.json())
                .then(poke => {
                    const clonedTemplate = temp.content.cloneNode(true);
                    const card = clonedTemplate.querySelector('article');

                    card.setAttribute('data-id', randomNumber);
                    card.classList.add('pokemon-card');  // Agrega una clase para filtrar
                    card.addEventListener('click', () => toggleCardSelection(card));

                    let name = clonedTemplate.querySelector('#name');
                    name.innerText = poke.name;

                    let img = clonedTemplate.querySelector('img');
                    img.setAttribute("src", poke.sprites.front_default);

                    let types = clonedTemplate.querySelector('#types');
                    const temporalTypes = poke.types.map(type => type.type.name);
                    types.innerHTML = temporalTypes.join("|");

                    let stats = clonedTemplate.querySelector('#stats');
                    const temporalAttack = "A:" + poke.stats[1].base_stat;
                    const temporalDefense = "D:" + poke.stats[2].base_stat;
                    stats.innerHTML = temporalAttack + "|" + temporalDefense;

                    pokeList.appendChild(clonedTemplate);
                    cartasGeneradas.push(card);  // Agrega la carta al array de cartas generadas
                })
                .catch(error => console.error('Error fetching Pokemon:', error));

            contador.value--;
        }
    }
}



function toggleCardSelection(card) {
    card.classList.toggle('selected');
}


function iniciarCombate() {
    const selectedCards = document.querySelectorAll('.selected');

    if (selectedCards.length === 2) {
        const card1 = selectedCards[0];
        const card2 = selectedCards[1];

        const attack1 = parseInt(card1.querySelector('#stats').innerText.split("|")[0].split(":")[1]);
        const defense2 = parseInt(card2.querySelector('#stats').innerText.split("|")[1].split(":")[1]);

        if (attack1 > defense2) {

            mostrarResultadoCombate(card1, card2,"");
        } else if (attack1 < defense2) {
            mostrarResultadoCombate(card1, card2, "");
        } else {
            mostrarResultadoCombate(card1, card2, "Empate.");
        }

        selectedCards.forEach(card => card.classList.remove('selected'));
    } else {
        alert("Debes seleccionar exactamente 2 cartas para combatir.");
    }
}

function mostrarResultadoCombate(card1, card2, resultado) {
    const resultadoCombate = document.getElementById('resultadoCombate');
    const nombreGanador = (resultado === "Empate.") ? "Empate" : ((resultado === "La primera carta seleccionada gana.") ? card1.querySelector('#name').innerText : card2.querySelector('#name').innerText);

    const mensajeGanador = document.createElement('div');
    mensajeGanador.innerHTML = `<div>${resultado}</div><div class="bold">Ganador: ${nombreGanador}</div>`;
    
    resultadoCombate.innerHTML = '';
    resultadoCombate.appendChild(mensajeGanador);
}


function filtrarPokemon() {
    const filtro = document.getElementById("filtroPoke").value.toLowerCase();

    cartasGeneradas.forEach(card => {
        const nombrePokemon = card.querySelector('#name').innerText.toLowerCase();
        if (nombrePokemon.includes(filtro)) {
            card.style.display = 'block';  // Mostrar la carta si coincide
        } else {
            card.style.display = 'none';   // Ocultar la carta si no coincide
        }
    });
}



