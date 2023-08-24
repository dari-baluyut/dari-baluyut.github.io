document.querySelector('#searchNameButton').addEventListener("click", searchPokemon);
var load = document.getElementById('searchLoad');
load.style.display = 'none';
const pId = document.querySelector('#pId');
const pName = document.querySelector('#pName');
const pImg = document.querySelector('#pImg');
const type1 = document.querySelector('#type1');
const type2 = document.querySelector('#type2');
const caps = (str) => str[0].toUpperCase()+str.substr(1);

function lowerCaseName(string) {
    return string.toLowerCase();
}

function searchPokemon(e) {
    loading();
    reset_animation();
    hidePokeInfo();
    load.style.display = '';
    
    const searchName = document.querySelector('#searchName').value;
    const pokeName = lowerCaseName(searchName);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
    .then(res => res.json())
    .then(data => {
        if(pokeName == data['name']) {
            showPokeInfo();
            // hideError();
        }
        pId.textContent = "#"+data['id'].toString().padStart(3, '0');
        pName.textContent = caps(data['name']);

        const dataTypes = data['types'];
        const dataFirstType = dataTypes[0];
        const dataSecondType = dataTypes[1];
        type1.src = "images/types/"+dataFirstType['type']['name']+".png";
        if(dataSecondType) {
            type2.classList.remove('hide');
            type2.src = "images/types/"+dataSecondType['type']['name']+".png";
        } else {
            type2.classList.add('hide');
            type2.src = "";
        }

        pImg.src = data['sprites']['other']['home']['front_default'] || '';
    })
    .catch(err => {
        console.log("Pokemon not found", err);
    });

    e.preventDefault();
}

function hidePokeInfo() {
    var pokeInfo = document.getElementById('pokedex');
    pokeInfo.style.display = 'none';
}

function showPokeInfo() {
    var pokeInfo = document.getElementById('pokedex');
    pokeInfo.style.display = '';
}

// function showError() {
//     var errorMessage = document.getElementById('noResult');
//     errorMessage.style.display = '';
// }

// function hideError() {
//     var errorMessage = document.getElementById('noResult');
//     errorMessage.style.display = 'none';
// }

function reset_animation() {
    var id = document.getElementById('pId');
    id.style.animation = 'none';
    id.offsetHeight;
    id.style.animation = null;

    var name = document.getElementById('pName');
    name.style.animation = 'none';
    name.offsetHeight;
    name.style.animation = null;

    var animationType1 = document.getElementById('type1');
    animationType1.style.animation = 'none';
    animationType1.offsetHeight;
    animationType1.style.animation = null;

    var animationType2 = document.getElementById('type2');
    animationType2.style.animation = 'none';
    animationType2.offsetHeight;
    animationType2.style.animation = null;

    var image = document.getElementById('pImg');
    image.style.animation = 'none';
    image.offsetHeight;
    image.style.animation = null; 
}

function loading() {
    var load1 = document.getElementById('l1');
    load1.style.animation = 'none';
    load1.offsetHeight;
    load1.style.animation = null;

    var load2 = document.getElementById('l2');
    load2.style.animation = 'none';
    load2.offsetHeight;
    load2.style.animation = null;

    var load3 = document.getElementById('l3');
    load3.style.animation = 'none';
    load3.offsetHeight;
    load3.style.animation = null;
    
    var load4 = document.getElementById('l4');
    load4.style.animation = 'none';
    load4.offsetHeight;
    load4.style.animation = null;
}