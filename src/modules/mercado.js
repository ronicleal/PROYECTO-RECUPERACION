import { Producto } from "./producto.js";

export const mercado = [
    // El 5to argumento (8) es el valor numérico del bonus. Como es 'Arma', da +8 de Ataque.
    //--Consumibles--//
    new Producto('Baya Aranja', 40, 'común', 'Consumible', 20), 
    new Producto('Superpoción', 110, 'raro', 'Consumible', 60),
    new Producto('Hiperpoción', 520, 'épico', 'Consumible', 150),

    //--Armaduras--//
    new Producto('Zinc', 180, 'común', 'Armadura', 6), 
    new Producto('Proteína', 320, 'raro', 'Armadura', 14),
    new Producto('Placa Acero', 880, 'épico', 'Armadura', 28),

    //-- Armas----//
    new Producto('Imán', 120, 'común', 'Arma', 8),
    new Producto('Bola Luminosa', 140, 'común', 'Arma', 7),
    new Producto('Piedra Trueno', 460, 'raro', 'Arma', 18),
    new Producto('Pokeball', 950, 'épico', 'Arma', 32),
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