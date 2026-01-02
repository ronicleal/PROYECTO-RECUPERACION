/**
 * Agrupa los elementos de un array según una función de selección.
 * @param {Array} array - Lista de elementos a agrupar.
 * @param {Function} selectorFn -Función que indica por qué propiedad agrupar.
 * 
 */

export function groupBy(array, selectorFn) {
    const grouped = {};
    // Recorremos cada elemento del array
    for (const item of array) {
        // Obtenemos la clave del grupo usando la función pasada como parámetro
        const key = selectorFn(item);
        // Si el grupo aún no existe dentro del objeto, lo inicializamos como un array vacío
        if (!grouped[key]) {
            grouped[key] = [];
        }
        // Añadimos el elemento actual dentro del grupo correspondiente
        grouped[key].push(item);
        console.log(grouped)
    }

    return grouped;
}

/**
 * Formateador de números a euros según la convención española.
 * Intl.NumberFormat() clase de JS para formatear números
 * @example
 * EUR.format(1500); // "1.500,00 €"
 */
export const EUR = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR'
});


/**
  * Permite mostrar u ocultar un elemento (escena) de la pantalla.
  * Selecciona todos los elementos con la clase scene y les remueve la clase active
  * Selecciona el elemento con el id especificado y le añade la clase active
  * @param {number} id - identificador del elemento.
  */
export function showScene(id) {
  document.querySelectorAll('.scene').forEach(
    element => element.classList.remove('active')
  );
  document.getElementById(id).classList.add('active');
}


/**
 * Función de utilidad para mapear el nombre de un ítem o enemigo a la ruta de su imagen.
 * @function obtenerImagen
 * @param {string} nombre - El nombre del ítem o enemigo.
 * @returns {string} La ruta del archivo de imagen correspondiente, o una ruta por defecto si no se encuentra.
 */
export function obtenerImagen(nombre) {
    const imagenes = {
        "Baya Aranja": "./image/Bayas_Aranja.png",
        "Superpoción": "./image/Super_pocion.png",
        "Hiperpoción": "./image/Hiperpocion.png",
        "Zinc": "./image/Zinc.png",
        "Proteína": "./image/proteina.png",
        "Placa Acero": "./image/placa_acero.png",
        "Imán": "./image/iman.png",
        "Bola Luminosa": "./image/bola_luminosa_.png",
        "Piedra Trueno": "./image/piedra_trueno.png",
        "Pokeball": "./image/pokebolla.png",
        "Quilava": "./image/Quilava.png",
        "Raticate": "./image/Raticate.png",
        "Sneasel": "./image/Sneasel.png",
        "Pyroar": "./image/Pyroar.png",
    };

    // Si no existe imagen, usa una genérica
    return imagenes[nombre] || "./image/default.png";
}


/**
 * Ejecuta una animación visual de monedas cayendo en la pantalla.
 * * Genera tres elementos de imagen en posiciones horizontales fijas (25%, 50%, 75%),
 * los inserta en el DOM y activa la animación CSS definida en la clase 'moneda-animada'.
 * * @function animacionMonedas
 * @description Crea un efecto visual de recompensa. Incluye una limpieza automática 
 * de los elementos del DOM tras 3.5 segundos para optimizar el rendimiento.
 */
export function animacionMonedas(){
  const monedas = `
    <img src="./image/moneda.png" alt="moneda" class="moneda-animada" style="left: 25%;">
    <img src="./image/moneda.png" alt="moneda" class="moneda-animada" style="left: 50%;">
    <img src="./image/moneda.png" alt="moneda" class="moneda-animada" style="left: 75%;">
  `
  //Insertamos al final del body
  document.body.insertAdjacentHTML('beforeend', monedas);

  //Eliminamos los elementos del DOM después de que termine la animación 3s
  setTimeout(() => {
    const elementos = document.querySelectorAll('.moneda-animada');
    elementos.forEach(el => el.remove());
  }, 3500);

}
