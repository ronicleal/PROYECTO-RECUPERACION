import { Producto } from "./producto.js";

export const mercado = [
    // El 5to argumento (8) es el valor numérico del bonus. Como es 'Arma', da +8 de Ataque.
    new Producto('Espada corta', 120, 'común', 'Arma', 8),
    new Producto('Arco de caza', 140, 'común', 'Arma', 7),
    new Producto('Armadura de cuero', 180, 'común', 'Armadura', 6), // Como es 'Armadura', da +6 de Defensa.
    new Producto('Poción pequeña', 40, 'común', 'Consumible', 20), // Como es 'Consumible', da +20 de Vida.
    new Producto('Espada rúnica', 460, 'raro', 'Arma', 18),
    new Producto('Escudo de roble', 320, 'raro', 'Armadura', 14),
    new Producto('Poción grande', 110, 'raro', 'Consumible', 60),
    new Producto('Mandoble épico', 950, 'épico', 'Arma', 32),
    new Producto('Placas dracónicas', 880, 'épico', 'Armadura', 28),
    new Producto('Elixir legendario', 520, 'épico', 'Consumible', 150),
];

export function filtrarPorRareza(rareza){
    return mercado.filter(producto => producto.rareza === rareza);
}

export function aplicarDescuentoPorRareza(rareza, porcentaje){
    return mercado.map(producto =>
        producto.rareza === rareza ? producto.aplicarDescuento(porcentaje) : producto
    );
}

export function buscarProducto(nombre){
    return mercado.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}

export function obtenerTodasLasRarezas(){
    return [...new Set(mercado.map(producto => producto.rareza))];
}