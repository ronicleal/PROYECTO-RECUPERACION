import { jugador } from "./modules/jugadores.js";


/*====VARIABLES GLOBALES====*/
const REGEX_NOMBRE = /^[A-Z][a-zA-Z\s]{0,19}$/;
const PUNTOS_DISPONIBLES = 10;
const VIDA_BASE = 100;

function escena1(){
    const btnCrear = document.getElementById("crear-jugador");

    //Funcion de actualizacion visual y calculo de puntos
    function validarYactualizarPuntos(){
        const ataque = parseInt(document.getElementById("ataque-input").value) || 0;
        const defensa = parseInt(document.getElementById("defensa-input").value) || 0;
        const vidaExtra = parteInt(document.getElementById("vida-input").value) || 0;

        //Suma de puntos repartidos
        
    }
}