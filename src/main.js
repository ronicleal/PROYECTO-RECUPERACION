import { Jugador } from "./modules/jugadores.js";

/*====VARIABLES GLOBALES====*/
const REGEX_NOMBRE = /^[A-Z][a-zA-Z\s]{0,19}$/;
const PUNTOS_DISPONIBLES = 10;
const VIDA_BASE = 100;

function escena1() {
    const btnCrear = document.getElementById("crear-jugador");

    //Funcion de actualizacion visual y calculo de puntos
    function validarYactualizarPuntos() {
        const ataque = parseInt(document.getElementById("ataque-input").value) || 0;
        const defensa = parseInt(document.getElementById("defensa-input").value) || 0;
        const vidaExtra = parseInt(document.getElementById("vida-input").value) || 0;

        //Suma de puntos repartidos
        const puntosRepartidos = ataque + defensa + vidaExtra;
        const puntosRestantes = PUNTOS_DISPONIBLES - puntosRepartidos;

        let valido = true;

        //1. Validar que ninguna propiedad sea negativa
        if (ataque < 0 || defensa < 0 || vidaExtra < 0) {
            valido = false;
        }

        //2. Validar el total de puntos (max 10 extra)
        if (puntosRepartidos > PUNTOS_DISPONIBLES) {
            valido = false;
        }

        //3. Actualizar el DOM
        document.getElementById("puntos-restantes").textContent =
            `Puntos disponibles para repartir (Máx. 10): ${puntosRestantes}`;

        document.getElementById("ataque-val").textContent = ataque;
        document.getElementById("defensa-val").textContent = defensa;
        document.getElementById("vida-val").textContent = VIDA_BASE + vidaExtra;

        //Resaltar si existe el limite
        if (!valido) {
            document.getElementById("puntos-restantes").style.color = 'red';
        } else {
            document.getElementById("puntos-restantes").style.color = "#102547";
        }

        //Devolvemos si es válido (Para el boton crear)
        return valido && (puntosRepartidos <= PUNTOS_DISPONIBLES);

    }

    // Asignar listeners a todos los inputs numéricos (para feedback visual instantáneo)
    document.querySelectorAll('.formulario-crear-jugador input[type="number"]').forEach(input => {
        input.addEventListener('input', validarYactualizarPuntos);
    });

    // Asegurar que se ejecuta la primera vez para setear los valores.
    validarYactualizarPuntos();

    //LOGICA DEL BOTON CREAR JUGADOR
    btnCrear.addEventListener("click", function () {
        const nombre = document.getElementById("nombre-jugador").value.trim();

        //Obtener valores finales (Aseguridando que se ejecute la validacion)
        const ataque = parseInt(document.getElementById("ataque-input").value) || 0;
        const defensa = parseInt(document.getElementById("defensa-input").value) || 0;
        const vidaExtra = parseInt(document.getElementById("vida-input").value) || 0;


        // A. Validar nombre (RegEx) y que no este vacio
        if (!nombre || !REGEX_NOMBRE.test(nombre)) {
            alert('⚠️ Error: El nombre debe tener la primera letra mayúscula, solo letras/espacios y no exceder los 20 caracteres.');
            return;
        }

        // B. Validar puntos y limite
        const puntosRepartidos = ataque + defensa + vidaExtra;
        if (puntosRepartidos > PUNTOS_DISPONIBLES || ataque < 0 || defensa < 0 || vidaExtra < 0) {
            alert(`⚠️ Error: El total de puntos repartidos (${puntosRepartidos}) no puede exceder el límite de ${PUNTOS_DISPONIBLES} o ser negativo.`);
            return;
        }

        //Crear jugador
        let jugador = new Jugador(nombre, ataque, defensa, VIDA_BASE + vidaExtra);

        //Mostrar el nombre en el HTML
        document.getElementById("nombre-jugador-display").textContent = jugador.nombre;

        //Mostrar el estado del jugador en la misma escena
        const estadoDiv = document.getElementById("estado-jugador");

        estadoDiv.innerHTML = `
        <table class="player-stasts-table">
            <thead>
                <tr>
                    <th>Parámetro</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>⚔️Ataque Base</td>
                    <td>${jugador.ataqueBase}</td>
                </tr>
                <tr>
                    <td>🛡️Defensa Base</td>
                    <td>${jugador.defensaBase}</td>
                </tr>
                <tr>
                    <td>♥️Vida Base </td>
                    <td>${jugador.vida} / ${jugador.vidaMax}</td>
                </tr>
                <tr>
                    <td>⭐Puntos </td>
                    <td>${jugador.puntos}</td>
                </tr>
            </tbody>
        </table>
        `



    })


}

escena1();