import { Jugador } from "./modules/jugadores.js";
import { aplicarDescuentoPorRareza, obtenerTodasLasRarezas } from "./modules/mercado.js";
import { animacionMonedas, showScene } from "./utils/utils.js";
import { obtenerImagen } from "./utils/utils.js";
import { Enemigo, Jefe } from "./modules/enemigos.js";
import { agruparPorNivel, batalla } from "./modules/ranking.js";

/*====VARIABLES GLOBALES====*/
const REGEX_NOMBRE = /^[A-Z][a-zA-Z\s]{0,19}$/;
const PUNTOS_DISPONIBLES = 10;
const VIDA_BASE = 100;
let seleccionados = [];
let jugador = null;
let enemigos = [];

/**
 * Punto de entrada del juego. Inicializa la primera escena.
 */
function iniciarJuego() {
    escena1();
}

/**
 * ESCENA 1: Configuración inicial del personaje.
 * Gestiona el formulario de creación, la validación del nombre mediante RegEx
 * y la distribución limitada de puntos de estadísticas (Ataque, Defensa, Vida).
 */
function escena1() {
    const btnCrear = document.getElementById("crear-jugador");
    const inputs = document.querySelectorAll('.formulario-crear-jugador input[type="number"]');
    document.getElementById("imagen-jugador").style.display = "none";


    /**
     * Valida en tiempo real que la suma de puntos no exceda el límite permitido.
     * Actualiza la visualización de puntos restantes en el DOM.
     * @param {Event} [e] - Evento de entrada del input.
     */
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




/**
 * ESCENA 2: Visualización del estado inicial.
 * Muestra la tarjeta de estadísticas finales del jugador tras la creación
 * y permite avanzar hacia la escena del mercado.
 */
function escena2() {
    // Ocultamos el formulario y mostramos la tarjeta de estado
    document.querySelector(".container-formulario").style.display = "none";
    document.getElementById("crear-jugador").style.display = "none";
    document.getElementById("titulo-crear-jugador").style.display = "none";
    document.getElementById("imagen-jugador").style.display = "block";


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




/**
 * ESCENA 3: Mercado de productos.
 * Genera dinámicamente el catálogo de productos con un sistema de descuentos aleatorios.
 * Permite seleccionar hasta 6 objetos, validando el saldo disponible del jugador.
 */
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


    //=== Mostrar productos en tarjetas ===

    mercadoDescontado.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card-producto");

        const img = document.createElement("img");
        img.src = obtenerImagen(producto.nombre);
        img.alt = producto.nombre;

        const texto = document.createElement("div");
        texto.innerHTML = producto.mostrarProducto();

        //Botón añadir o quitar de la cesta
        const btnAñadir = document.createElement("button");
        btnAñadir.classList.add("btn-añadir");
        btnAñadir.textContent = "Añadir";
        btnAñadir.style.marginTop = "5px";

        btnAñadir.addEventListener("click", () => {
            if (!seleccionados.includes(producto)) {
                //Validacion si hay dinero suficiente para comprar el producto
                const costeTotal = seleccionados.reduce((total, p) => total + p.precio, 0);

                if(jugador.dinero - (costeTotal + producto.precio) < 0) {
                    alert("¡No tiene sufiente dinero para añadir este producto!");
                    return;
                }

                //Si hay dinero se añade
                if(seleccionados.length >= 6){
                    alert("Tu carrito esta lleno!");
                    return;
                }
                //Añadir a la cesta
                seleccionados.push(producto);
                card.classList.add("selected");
                btnAñadir.textContent = "Retirar";
            } else {
                //Quitar de la cesta
                seleccionados = seleccionados.filter(p => p !== producto);
                card.classList.remove("selected");
                btnAñadir.textContent = "Añadir";
            }

            mostrarSeleccionados();
            actualizarMonedero();
        });

        card.appendChild(img);
        card.appendChild(texto);
        card.appendChild(btnAñadir);
        container.appendChild(card);
    });

    /**
     * Actualiza visualmente los slots del inventario en el footer.
     */
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

    /**
     * Calcula y muestra el saldo provisional restando el coste de la cesta actual.
     */
    function actualizarMonedero(){
        const costeCesta = seleccionados.reduce((total, p) => total + p.precio, 0);
        const dineroProvisional = jugador.dinero - costeCesta;

        //Mostramos cuanto dinero queda en la bolsa
        document.getElementById("dinero-actual").textContent = dineroProvisional;

    }


    //Boton comprar y pasar a la siguiente escena
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

        const costeTotal = seleccionados.reduce((total, p) => total + p.precio, 0);

        if(confirm(`¿Realizar compra de ${costeTotal}?`)){
            if(jugador.gastarDinero(costeTotal)){
                seleccionados.forEach(item => jugador.añadirItem(item));

                document.getElementById("dinero-actual").textContent = jugador.dinero;
                showScene("enemies");
                escena4();
       

            }else{
                alert("No tienes suficiente dinero.");
            }
        }


        
        
    })



}



/**
 * ESCENA 4: Preparación para el combate.
 * Muestra el estado actualizado del jugador con los bonos de los objetos comprados
 * (Ataque total, Defensa total y Vida máxima con consumibles).
 */
function escena4(){
    const contenedor = document.getElementById("enemies-container");
    contenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Estado Actual del Jugador";

    
    const nombreJugador = document.createElement("p");
    nombreJugador.classList.add("nombre-jugador-escena4")
    nombreJugador.textContent = `${jugador.nombre}`;

    contenedor.appendChild(titulo);
    contenedor.appendChild(nombreJugador);

    jugador.vida = jugador.vidaTotal;

    //Contenedor del estado actual
    const estadoActual = document.createElement("div");
    estadoActual.classList.add("player-estado-final");

    estadoActual.innerHTML =  `
    <div class="stats-container-final">
            <div class="stat-row">
                <div class="stat-box-final">⚔️ Ataque: ${jugador.ataqueTotal}</div>
                <div class="stat-box-final">🛡️ Defensa: ${jugador.defensaTotal}</div>
            </div>

            <div class="stat-row">
                <div class="stat-box-final">❤️ Vida: ${jugador.vida} / ${jugador.vidaTotal}</div>
                <div class="stat-box-final">⭐ Puntos: ${jugador.puntos}</div>
            </div>
    </div>
        `;

    contenedor.appendChild(estadoActual);

    //Boton para ir a la siguiente escena
    const btnContinuarEnemigos = document.createElement("button");
    btnContinuarEnemigos.id = "continuar-enemigos";
    btnContinuarEnemigos.classList.add("continuar-enemigos");
    btnContinuarEnemigos.textContent = "Continuar";

    contenedor.appendChild(btnContinuarEnemigos);

    btnContinuarEnemigos.addEventListener("click", () => {
        escena5();
    });

}



/**
 * ESCENA 5: Galería de villanos.
 * Presenta a los oponentes y al jefe final (Pyroar), mostrando sus estadísticas 
 * antes de iniciar la secuencia de batallas.
 */
function escena5(){
    const contendor = document.getElementById("enemies");
    contendor.innerHTML ="";

    enemigos = [
        new Enemigo("Quilava", 5, 30),
        new Enemigo("Raticate", 12, 50),
        new Enemigo("Sneasel", 8, 40),
        new Jefe("Pyroar", 20, 120, 1.2),
    ];

    const titulo = document.createElement("h2");
    titulo.textContent = "Enemigos";
    contendor.appendChild(titulo);

    //Contenedor de enemigos
    const listaEnemigos = document.createElement("div");
    listaEnemigos.classList.add("lista-enemigos");

    enemigos.forEach(enemigo => {
        const card = document.createElement("div");
        card.classList.add("card-enemigo");

        const img = document.createElement("img");
        img.src = obtenerImagen(enemigo.nombre);
        img.alt = enemigo.nombre;

        const info = document.createElement("p");
        info.classList.add("info-enemigos");
        info.innerHTML = `
        <strong>${enemigo.nombre}</strong><br>
        ${enemigo.ataque} puntos de ataque
        `;

        card.appendChild(img);
        card.appendChild(info);
        listaEnemigos.appendChild(card);
    });

    contendor.appendChild(listaEnemigos);

    //Boton para ir a la siguiente escena
    const btnContinuarBatalla = document.createElement("button");
    btnContinuarBatalla.id = "continuar-batalla";
    btnContinuarBatalla.classList.add("continuar-batalla");
    btnContinuarBatalla.textContent = "Continuar";
    
    contendor.appendChild(btnContinuarBatalla);

    btnContinuarBatalla.addEventListener("click", () => {
        showScene("battle");
        escena6();

    });

    
}


/**
 * ESCENA 6: Secuencia de combate.
 * Gestiona el enfrentamiento sucesivo contra la lista de enemigos.
 * Ejecuta animaciones visuales de monedas al ganar y controla la transición 
 * al resultado final o derrota.
 */
function escena6(){
    const contenedor = document.getElementById("battle");
    contenedor.innerHTML = "";

    //El jugador comienza la batalla con su vida máxima
    jugador.vida = jugador.vidaTotal;

    //Definimos los oponentes
    const listaEnemigos = [
        new Enemigo("Quilava", 5, 30),
        new Enemigo("Raticate", 12, 50),
        new Enemigo("Sneasel", 8, 40),
        new Jefe("Pyroar", 20, 120, 1.2),
    ];

    let indiceActual = 0;

    /**
     * Procesa recursivamente el siguiente oponente en la lista.
     */
    function procesarSiguienteCombate(){
        contenedor.innerHTML = "";
        const enemigo = listaEnemigos[indiceActual];

        // Ejecucion de la logica del combate
        // Utilizamos la funcion batalla del ranking
        const resultado = batalla(jugador, enemigo);
        const gano = resultado.ganador === jugador.nombre;

        if (gano){
            animacionMonedas(); //Se disparan las monedas si gana
        }


        const titulo = document.createElement("h2");
        titulo.textContent = "Combates"
        contenedor.appendChild(titulo);

        const area = document.createElement("div");
        area.classList.add("battle-area");

        area.innerHTML= `
            <div class="battle-card player ${gano ? 'ganar' : 'perder'}">
                <p>${jugador.nombre}</p>
                <img src="./image/pikachu.png" style="width:120px">
                <p>♥️Vida restante: ${jugador.vida}</p>
                <p>⚔️Ataque total: ${jugador.ataqueTotal}</p>
            </div>

            <h2>VS</h2>

            <div class="battle-card enemy">
                <p>${enemigo.nombre}</p>
                <img src="${obtenerImagen(enemigo.nombre)}">
                <p>♥️Vida: ${enemigo.vida}</p>
                <p>⚔️Ataque: ${enemigo.ataque}</p>

            
        `
        contenedor.appendChild(area);

        //Animacion de movimiento de las tarjetas
        const cards = area.querySelectorAll('.battle-card');
        setTimeout(() => {
            cards.forEach(card => card.classList.add("animate-in"));
        }, 20);


        //Panel de puntos conseguidos
        const infoPuntos = document.createElement("div");
        infoPuntos.className = "mensaje-batalla";
        infoPuntos.innerHTML = `
            <p>${gano ? 'Ganador' : 'Derrotado'} : ${jugador.nombre}</p>
            <p>Puntos Ganados: ${jugador.puntos}</p>

        
        `
        contenedor.appendChild(infoPuntos);

        //Boton para continuar
        const btnContinuar = document.createElement("button");
        btnContinuar.className = "continuar-mercado";
        
        if(!gano){
            btnContinuar.textContent = "Continuar";
            btnContinuar.addEventListener("click", () => {
                showScene("final");
                escena7(false);
            });
        }else if(indiceActual < listaEnemigos.length -1){
            btnContinuar.textContent = "Continuar";
            btnContinuar.addEventListener("click", () =>{
                indiceActual++
                procesarSiguienteCombate();
            });
        }else{
            btnContinuar.textContent = "Continuar";
            btnContinuar.addEventListener("click", () => {
                showScene("final");
                escena7(true);
            });
        }

        contenedor.appendChild(btnContinuar);




    }

    procesarSiguienteCombate();
}



/**
 * ESCENA 7: Evaluación de resultados.
 * Calcula la puntuación final sumando el dinero restante, clasifica al jugador
 * como 'Veterano' o 'Novato' y guarda el registro en LocalStorage.
 */
function escena7(){
    const contenedor = document.getElementById("final");
    contenedor.innerHTML = "";

    //Sumar monedas restantes a los puntos totales
    const monedasExtras = jugador.dinero;
    jugador.puntos += monedasExtras;

    //Guardar en LocalStorage
    const nuevoRegistro = {
        nombre: jugador.nombre,
        puntos: jugador.puntos,
        dinero : monedasExtras
    };

    //Obtenemos los datos previos del LocalStorage o un array vacio si no hay nada
    let historial = JSON.parse(localStorage.getItem("registroJuego")) || [];
    historial.push(nuevoRegistro);
    localStorage.setItem("registroJuego", JSON.stringify(historial));


    const titulo = document.createElement("h2");
    titulo.textContent = "Resultado final";

    contenedor.appendChild(titulo);

    //Agrupamos por nivel
    const grupos = agruparPorNivel([jugador], 300);

    //Contenedor para el texto
    const infoFinal = document.createElement("div");
    infoFinal.classList.add("info-final-container");

    //Creamos el párrafo el ranking
    const ranking = document.createElement("p");
    ranking.classList.add("final-text");

    //Utilizamos la agrupación para definir el nivel
    if(grupos.Veterano?.length){
        ranking.innerHTML = `
        El jugador <strong>${jugador.nombre}</strong> ha logrado ser un: <br>
        <span class="rango-badge veterano">🥇 Veterano</span> <br>
        Puntos totales: <strong>${jugador.puntos}</strong>
        `;
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }else{
        ranking.innerHTML = `
        El jugador <strong>${jugador.nombre}</strong> es un: <br>
        <span class="rango-badge novato">👎 Novato</span> <br> 
        `;
    }

    infoFinal.appendChild(ranking)
    contenedor.appendChild(infoFinal);

    //Botón continuar a tabla de clasificación
    const btnContinuarTabla = document.createElement("button");
    btnContinuarTabla.className = "continuar-mercado";
    btnContinuarTabla.textContent = "Ver Clasificación"
    btnContinuarTabla.addEventListener("click", () => {
        showScene("final");
        escena8();
    });

    contenedor.appendChild(btnContinuarTabla);
}



/**
 * ESCENA 8: Ranking histórico.
 * Recupera el historial de partidas de LocalStorage y genera una tabla comparativa.
 * Ofrece opciones para ver los datos por consola o reiniciar la aplicación.
 */
function escena8(){
    const contenedor = document.getElementById("final");
    contenedor.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Ranking";
    contenedor.appendChild(titulo);

    //Recuperar datos del LocalStorage
    const historial = JSON.parse(localStorage.getItem("registroJuego")) || [];

    const tabla = document.createElement("table");
    tabla.classList.add("tabla-ranking");

    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Puntos</th>
                <th>Dinero</th>
            </tr>
        </thead>
        <tbody>
            ${historial.map(reg => `
                <tr>
                    <td>${reg.nombre}</td>
                    <td>${reg.puntos}</td>
                    <td>${reg.dinero}</td>
                </tr>
                
            `).join('')}
        </tbody>
    
    `;
    
    //Si no hay datos se muestra un mensaje
    if(historial.length === 0){
        tabla.innerHTML = "<tr><td colspan='3'>No hay registro aún</td></tr>";

    }

    contenedor.appendChild(tabla);

    //Boton para mostrar por consola la tabla
    const btnConsola = document.createElement("button");
    btnConsola.textContent = "Ver Ranking Consola";
    btnConsola.classList.add("btn-consola");
    btnConsola.addEventListener("click", () => {
        console.table(historial);
    });
    contenedor.appendChild(btnConsola);
    

    //Boton reiniciar
    const btnReiniciar = document.createElement("button");
    btnReiniciar.textContent = "Reiniciar";
    btnReiniciar.classList.add("continuar-mercado");
    btnReiniciar.addEventListener("click", ()=> {
        location.reload();
    });

    contenedor.appendChild(btnReiniciar);



}

iniciarJuego();

