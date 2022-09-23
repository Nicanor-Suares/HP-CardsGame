class cardsGame {
    constructor(tiempoTotal, cards) {
        this.arrayCartas = cards;
        this.tiempoTotal = tiempoTotal;
        this.tiempoRestante = tiempoTotal;
        this.timer = document.getElementById('tiempo');
        this.intentos = document.getElementById('intentos');        
    }
    empezarJuego(){
        this.cartaCheck = null;
        this.clicksTotales = 0;
        this.tiempoRestante = this.tiempoTotal;
        this.cartasIguales = [];
        this.noPuedeVoltear = true;    

        // Darle tiempo para empezar
        setTimeout(() => {
            this.contador = this.empezarContador();
            this.noPuedeVoltear = false;
        }, 500);

        this.esconderCartas();
        this.timer.innerText = this.tiempoRestante;
        this.intentos.innerText = this.clicksTotales;

    }

    esconderCartas(){
        this.arrayCartas.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }

    voltearCarta(card){
        if(this.puedeVoltear(card)){
            this.clicksTotales++;
            this.intentos.innerText = this.clicksTotales;
            card.classList.add('visible');

            if(this.cartaCheck){
                this.sonIguales(card);
            } else{
                this.cartaCheck = card;
            }
        }
    }

    sonIguales(card){
        if(this.obtenerCarta(card) === this.obtenerCarta(this.cartaCheck)){
            this.iguales(card, this.cartaCheck);
        } else {
            this.noSonIguales(card, this.cartaCheck);
        }
        this.cartaCheck = null;
    }

    iguales(card1, card2){
        this.cartasIguales.push(card1)
        this.cartasIguales.push(card2);

        card1.classList.add('matched');
        card2.classList.add('matched');

        if(this.cartasIguales.length === this.arrayCartas.length){
            this.victory();
        }

    }

    noSonIguales(card1, card2){
        this.noPuedeVoltear = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.noPuedeVoltear = false;
        }, 1500);
    }

    obtenerCarta(card){
        return card.getElementsByClassName('nombre-personaje')[0].innerHTML;
    }

    puedeVoltear(card){
        return (!this.noPuedeVoltear && !this.cartasIguales.includes(card) && card !== this.cartaCheck);
    }

    empezarContador(){
        return setInterval(() => {
            this.tiempoRestante--;
            this.timer.innerText = this.tiempoRestante;
            if(this.tiempoRestante === 0){
                this.juegoTerminado();
            }
        }, 1000);
    }

    juegoTerminado(){
        clearInterval(this.contador);
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory(){
        clearInterval(this.contador);
        let intentosTotales = document.getElementById('intentosTotales');
        intentosTotales.innerText = this.clicksTotales;
        document.getElementById('victory-text').classList.add('visible');
    }

}

const cartas = document.getElementById('cartas');
const templateCartas = document.getElementById('cartas-template').content;
const fragment = document.createDocumentFragment();

console.log(templateCartas);

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
})

const fetchData = async () => {
    try {

        //traer info de api HP
        const res = await fetch('http://hp-api.herokuapp.com/api/characters');
        const data = await res.json();

        //Filtrar cartas con imágenes, duplicar y desordenar
        const cartasTotales = data.filter(personaje => personaje.image.length !== 0);
        cartasDuplicadas = cartasTotales.concat(cartasTotales);
        const cartasDesordenadas = cartasDuplicadas.sort((a, b) => 0.5 - Math.random());
        
        //Traer overlay para quitar al empezar a jugar o reiniciar
        let overlays = Array.from(document.getElementsByClassName('overlay-text'));        
        
        //Llamar a función para imprimir las cartas
        mostrarCartas(cartasDesordenadas);
        
        // Traer las cartas
        let cards = Array.from(document.getElementsByClassName('carta'));

        overlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.classList.remove('visible');
                juego.empezarJuego();
            })
        });
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                juego.voltearCarta(card);
            })
        });

        // Crear juego
        let juego = new cardsGame(600, cards)
        
    } catch (error) {
        console.log('ERROR - Error al cargar el contenido');
    }
}

const mostrarCartas = data => {
    data.forEach(personaje => {
        templateCartas.querySelector('.nombre-personaje').textContent = personaje.name;            
        templateCartas.querySelector('.img-personaje').src = personaje.image;

        const clone = templateCartas.cloneNode(true);
        fragment.appendChild(clone);
    })
    cartas.appendChild(fragment);
}