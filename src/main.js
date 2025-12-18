import { Jugador } from "./modules/jugadores.js";
import { aplicarDescuentoPorRareza, obtenerTodasLasRarezas } from "./modules/mercado.js";
import { showScene } from "./utils/utils.js";

/*====VARIABLES GLOBALES====*/
const REGEX_NOMBRE = /^[A-Z][a-zA-Z\s]{0,19}$/;
const PUNTOS_DISPONIBLES = 10;
const VIDA_BASE = 100;
let seleccionados = [];

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
            <div class="stats-grid">
                <div class="stat-box">⚔️ Ataque: ${jugador.ataqueBase}</div>
                <div class="stat-box">🛡️ Defensa: ${jugador.defensaBase}</div>
                <div class="stat-box">❤️ Vida: ${jugador.vida} / ${jugador.vidaMax}</div>
                <div class="stat-box">⭐ Puntos: ${jugador.puntos}</div>
            </div>
        `;

        let btnContinuar = document.getElementById("continuar-mercado");
        if(!btnContinuar){
            btnContinuar = document.createElement("button");
            btnContinuar.id = "continuar-mercado";
            btnContinuar.classList="continuar-mercado";
            btnContinuar.textContent = "Continuar-Mercado";
            estadoDiv.appendChild(btnContinuar);

            btnContinuar.addEventListener("click", () => {
                showScene("market");
                escena2();
            })
        }

        
        
        


    })


}


function escena2() {
    seleccionados = []; // Lista de productos seleccionados
    const container = document.getElementById("market-container");
    container.innerHTML = "";

    //=== Lógica del descuento ===

    // 1. Obtener todas las rarezas únicas
    const todasLasRarezas = obtenerTodasLasRarezas();
    // 2. Elegir una rareza aleatoria a la que aplicar el descuento
    const rarezaDescontada = todasLasRarezas[Math.floor(Math.random() * todasLasRarezas.length)];
    // 3. Generar un descuento aleatorio de 0 al 30%
    const descuentoAleatorio = Math.floor(Math.random() * 31);
    // 4. Aplicar el descuento solo a los productos de esa rareza
    const mercadoDescontado = aplicarDescuentoPorRareza(rarezaDescontada, descuentoAleatorio);

    //=== Notificación del descuento ===

    // 1. Contenedor de notificacion del descuento en los productos
    let notifArea = document.getElementById("notificacion-mercado");
    if(!notifArea){
        notifArea = document.createElement("div");
        notifArea.id = "notificacion-mercado";
        //Insertar la notificacion antes del contendor de productos
        container.parentNode.insertBefore(notifArea, container);
    }
    notifArea.innerHTML = ""; //Limpiar notificaciones anteriores

    // 2. Crear el elemento de notificacion
    const notificacionDescuento = document.createElement("p");
    notificacionDescuento.classList.add("descuento-notificacion");
    // 3. Asignar el contenido dinámico
    notificacionDescuento.textContent = `🚨 ¡OFERTA! Descuento del 📢${descuentoAleatorio}%🎉 aplicado a ítems de rareza: ${rarezaDescontada.toUpperCase()} 🚨`;
    // 4. Insertar la notificación a su nuevo contenedor
    notifArea.appendChild(notificacionDescuento);

    //=== Mostrar productos en tarjetas ===

    mercadoDescontado.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card-producto");

        const img = document.createElement("img");
        img.src = obtenerImagen(producto.nombre);
        img.alt = producto.nombre;

        const texto = document.createElement("p");
        texto.textContent = producto.mostrarProducto();

        //Botón añadir o quitar de la cesta
        const btnAñadir = document.createElement("button");
        btnAñadir.textContent = "Añadir";
        btnAñadir.style.marginTop = "5px";

        btnAñadir.addEventListener("click", () => {
            if(!seleccionados.includes(producto)){
                //Añadir a la cesta
                seleccionados.push(producto);
                card.classList.add("selected");
                btnAñadir.textContent = "Retirar";
            }else{
                //Quitar de la cesta
                seleccionados = seleccionados.filter(p => p !== producto);
                card.classList.add("selected");
                btnAñadir.textContent = "Añadir";
            }

            //Aqui pongo luego la funcion mostrarSeleccionados();
        });

        card.appendChild(img);
        card.appendChild(texto);
        card.appendChild(btnAñadir);
        container.appendChild(card);
    });




    

}

escena1();

function obtenerImagen(nombre){
    const imagenes = {
        "Espada corta": "./image/espada.png",
        "Arco de caza": "./image/b_t_01.png",
        "Armadura de cuero": "./image/armor.png",
        "Poción pequeña": "./image/hp.png",
        "Espada rúnica": "./image/espada_runica.png",
        "Escudo de roble": "./image/shield.png",
        "Poción grande": "./image/pocion_grande.png",
        "Mandoble épico": "./image/mandoble.png",
        "Placas dracónicas": "./image/placas_draconicas.png",
        "Elixir legendario": "./image/elixir_legendario.png",
        "Goblin": "./image/goblin.png",
        "Orco Guerrero": "./image/orco.png",
        "Esqueleto": "./image/esqueleto.png",
        "Dragón Rojo": "./image/dragon.png",
    };

    // Si no existe imagen, usa una genérica
    return imagenes[nombre] || "./image/default.png";
}