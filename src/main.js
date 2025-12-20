import { Jugador } from "./modules/jugadores.js";
import { aplicarDescuentoPorRareza, obtenerTodasLasRarezas } from "./modules/mercado.js";
import { showScene } from "./utils/utils.js";

/*====VARIABLES GLOBALES====*/
const REGEX_NOMBRE = /^[A-Z][a-zA-Z\s]{0,19}$/;
const PUNTOS_DISPONIBLES = 10;
const VIDA_BASE = 100;
let seleccionados = [];
let jugador = null;

function iniciarJuego() {
    escena1();
}

// ESCENA 1: Formulario y lógica de puntos
function escena1() {
    const btnCrear = document.getElementById("crear-jugador");
    const inputs = document.querySelectorAll('.formulario-crear-jugador input[type="number"]');

    //Funcion de actualizacion visual y calculo de puntos
    function validarYactualizarPuntos(e) {
        const ataqueInput = document.getElementById("ataque-input");
        const defensaInput = document.getElementById("defensa-input");
        const vidaInput = document.getElementById("vida-input");

        let ataque = parseInt(ataqueInput.value) || 0;
        let defensa = parseInt(defensaInput.value) || 0;
        let vidaExtra = parseInt(vidaInput.value) || 0;


        // --- RESTRICCIÓN PARA NO EXCEDER LOS 10 PUNTOS ---
        let totalActual = ataque + defensa + vidaExtra;

        if (totalActual > PUNTOS_DISPONIBLES) {
            // Calculamos cuánto nos hemos pasado
            const exceso = totalActual - PUNTOS_DISPONIBLES;
            if (e && e.target) {
                // Restamos ese exceso al input que el usuario acaba de cambiar
                e.target.value = parseInt(e.target.value) - exceso;
                // Actualizamos las variables locales con el nuevo valor corregido
                ataque = parseInt(ataqueInput.value) || 0;
                defensa = parseInt(defensaInput.value) || 0;
                vidaExtra = parseInt(vidaInput.value) || 0;
            }
        }

        //Suma de puntos repartidos
        const puntosRepartidos = ataque + defensa + vidaExtra;
        const puntosRestantes = PUNTOS_DISPONIBLES - puntosRepartidos;

        //3. Actualizar el DOM
        document.getElementById("puntos-restantes").textContent =
            `Puntos disponibles para repartir (Máx. 10): ${puntosRestantes}`;

        document.getElementById("ataque-val").textContent = ataque;
        document.getElementById("defensa-val").textContent = defensa;
        document.getElementById("vida-val").textContent = VIDA_BASE + vidaExtra;

    }

    inputs.forEach(input => {
        input.addEventListener('input', (e) => validarYactualizarPuntos(e));
    });

    //LOGICA DEL BOTON CREAR JUGADOR
    btnCrear.addEventListener("click", function () {
        const nombre = document.getElementById("nombre-jugador").value.trim();

        //Obtener valores finales (Aseguridando que se ejecute la validacion)
        const ataque = parseInt(document.getElementById("ataque-input").value) || 0;
        const defensa = parseInt(document.getElementById("defensa-input").value) || 0;
        const vidaExtra = parseInt(document.getElementById("vida-input").value) || 0;


        // A. Validar nombre (RegEx) y que no este vacio
        if (!nombre || !REGEX_NOMBRE.test(nombre)) {
            alert('⚠️ Nombre inválido: Primera letra mayúscula y máx 20 caracteres.');
            return;
        }

        //Crear jugador
        jugador = new Jugador(nombre, ataque, defensa, VIDA_BASE + vidaExtra);

        // Pasamos a la Escena 2
        escena2();

    });

    // Asegurar que se ejecuta la primera vez para setear los valores.
    validarYactualizarPuntos();




}

// ESCENA 2: Visualización del estado inicial
function escena2() {
    // Ocultamos el formulario y mostramos la tarjeta de estado
    document.querySelector(".container-formulario").style.display = "none";
    document.getElementById("crear-jugador").style.display = "none";
    

    //Mostrar el nombre en el HTML
    document.getElementById("nombre-jugador-display").textContent = jugador.nombre;

    //Mostrar el estado del jugador en la misma escena
    const estadoDiv = document.getElementById("estado-jugador");

    estadoDiv.innerHTML = `
    <div class="stats-container-final">
            <div class="stat-row">
                <div class="stat-box-final">⚔️ Ataque: ${jugador.ataqueBase}</div>
                <div class="stat-box-final">🛡️ Defensa: ${jugador.defensaBase}</div>
            </div>

            <div class="stat-row">
                <div class="stat-box-final">❤️ Vida: ${jugador.vida} / ${jugador.vidaMax}</div>
                <div class="stat-box-final">⭐ Puntos: ${jugador.puntos}</div>
            </div>
    </div>
        `;

    let btnContinuar = document.getElementById("continuar-mercado");
    if (!btnContinuar) {
        btnContinuar = document.createElement("button");
        btnContinuar.id = "continuar-mercado";
        btnContinuar.classList = "continuar-mercado";
        btnContinuar.textContent = "Continuar";
        estadoDiv.appendChild(btnContinuar);

        btnContinuar.addEventListener("click", () => {
            showScene("market");
            escena3();
        })
    }


}





function escena3() {
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
    if (!notifArea) {
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
            if (!seleccionados.includes(producto)) {
                if(seleccionados.length >= 6){
                    alert("Tu mochila esta llena!");
                    return;
                }
                //Añadir a la cesta
                seleccionados.push(producto);
                card.classList.add("selected");
                btnAñadir.textContent = "Retirar";
            } else {
                //Quitar de la cesta
                seleccionados = seleccionados.filter(p => p !== producto);
                card.classList.add("selected");
                btnAñadir.textContent = "Añadir";
            }

            mostrarSeleccionados();
        });

        card.appendChild(img);
        card.appendChild(texto);
        card.appendChild(btnAñadir);
        container.appendChild(card);
    });

    function mostrarSeleccionados(){
        //1. Obtengo todos los slot del inventario
        const slots = document.querySelectorAll(".inventory-slot");

        //2. Limpio todos los slots antes de volver a pintar
        slots.forEach(slot => slot.innerHTML = "");

        //3. Recorro toda la lista de productos seleccionados
        seleccionados.forEach((producto, indice) => {
            //Si hay un slot disponible para este indice
            if(slots[indice]){
                const img = document.createElement("img");
                //Llamo a la funcion obtener imagen
                img.src = obtenerImagen(producto.nombre);
                img.alt = producto.nombre;
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "contain";

                slots[indice].appendChild(img);
            }
        })

    }

    const btnComprar = document.createElement("button");
    btnComprar.id = "btn-comprar";
    btnComprar.textContent = "Comprar";
    btnComprar.classList.add("btn-comprar");
    
    const marketScene = document.getElementById("market");
    marketScene.appendChild(btnComprar);

    btnComprar.addEventListener("click", () => {
        if(seleccionados.length === 0){
            alert("No has seleccionado ningún producto!");
            return;
        }

        showScene("enemies");
        escena4();
        
    })






}

function escena4(){
    const contenedor = document.getElementById("enemies-container");
    contenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Estado Actual del Jugador";
    contenedor.appendChild(titulo);
}





iniciarJuego();

function obtenerImagen(nombre) {
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