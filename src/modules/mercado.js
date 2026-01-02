import { Producto } from "./producto.js";

/**
 * Lista de productos disponibles en la tienda.
 * Incluye consumibles (Vida), armaduras (Defensa) y armas (Ataque).
 * @type {Producto[]}
 */
export const mercado = [
    // El 5to argumento (8) es el valor numérico del bonus. Como es 'Arma', da +8 de Ataque.
    //--Consumibles--//
    new Producto('Baya Aranja', 40, 'común', 'Consumible', 20), 
    new Producto('Superpoción', 70, 'raro', 'Consumible', 60),
    new Producto('Hiperpoción', 80, 'épico', 'Consumible', 150),

    //--Armaduras--//
    new Producto('Zinc', 30, 'común', 'Armadura', 6), 
    new Producto('Proteína', 50, 'raro', 'Armadura', 14),
    new Producto('Placa Acero', 90, 'épico', 'Armadura', 28),

    //-- Armas----//
    new Producto('Imán', 50, 'común', 'Arma', 8),
    new Producto('Bola Luminosa', 60, 'común', 'Arma', 7),
    new Producto('Piedra Trueno', 70, 'raro', 'Arma', 18),
    new Producto('Pokeball', 100, 'épico', 'Arma', 32),
];

/**
 * Filtra los productos del mercado según su nivel de rareza.
 * @param {string} rareza - La rareza a filtrar (ej. 'común', 'raro', 'épico').
 * @returns {Producto[]} Un array con los productos que coinciden con la rareza.
 */
export function filtrarPorRareza(rareza){
    return mercado.filter(producto => producto.rareza === rareza);
}

/**
 * Aplica un descuento porcentual a todos los productos de una rareza específica.
 * @param {string} rareza - La rareza a la que se aplicará el descuento.
 * @param {number} porcentaje - El porcentaje de descuento (ej. 10 para 10%).
 * @returns {Producto[]} El array del mercado con los precios actualizados donde corresponda.
 */
export function aplicarDescuentoPorRareza(rareza, porcentaje){
    return mercado.map(producto =>
        producto.rareza === rareza ? producto.aplicarDescuento(porcentaje) : producto
    );
}

/**
 * Busca un producto específico por su nombre (insensible a mayúsculas).
 * @param {string} nombre - El nombre del producto a buscar.
 * @returns {Producto|null} El objeto Producto encontrado o null si no existe.
 */
export function buscarProducto(nombre){
    return mercado.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}

/**
 * Obtiene una lista con los nombres únicos de todas las rarezas presentes en el mercado.
 * @returns {string[]} Array de strings con las rarezas únicas (ej. ['común', 'raro', 'épico']).
 */
export function obtenerTodasLasRarezas(){
    return [...new Set(mercado.map(producto => producto.rareza))];
}