import { EUR } from "../utils/utils.js";

/**
 * Representa un objeto comprable en el mercado con estadísticas específicas.
 * @class
 */
export class Producto{
    nombre;
    precio;
    rareza;
    tipo;
    bonus;

    /**
     * Crea una instancia de Producto.
     * @param {string} nombre - Nombre del producto.
     * @param {number} precio - Precio inicial.
     * @param {string} rareza - Nivel de rareza.
     * @param {string} tipo - Tipo de estadística que afecta.
     * @param {number} bonus - Cantidad de puntos que suma a la estadística.
     */
    constructor(nombre, precio, rareza, tipo, bonus){
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    /**
     * Genera la representación HTML del producto para ser mostrada en la interfaz.
     * Traduce el 'tipo' interno a una etiqueta legible (Ataque, Defensa, Vida).
     * @returns {string} Bloque de código HTML con la información del producto.
     */
    mostrarProducto(){
        // Usamos el 'tipo' para describir qué da el bonus.
        let efectoBonus = '';
        switch(this.tipo){
            case 'Arma':
                efectoBonus = 'Ataque';
                break;
            case 'Armadura':
                efectoBonus = 'Defensa';
                break;
            case 'Consumible':
                efectoBonus = 'Vida';
                break;
            default:
                efectoBonus = 'Efecto Desconocido';
        }

        return `
            <div class="info-producto">
                <h4 class="prod-nombre">${this.nombre}</h4>
                <span class="prod-tipo">${efectoBonus}: + ${this.bonus}</span>
                <p class="prod-precio">${EUR.format(this.precio)}</p>
            </div>
        `;
    }

    /**
     * Crea una nueva instancia del producto con un precio rebajado.
     * El porcentaje se valida para que esté siempre en el rango [0, 100].
     * @param {number} porcentaje - El porcentaje de descuento a aplicar.
     * @returns {Producto} Una nueva instancia de Producto con el precio actualizado y redondeado.
     */
    aplicarDescuento(porcentaje){
        // Limita el porcentaje entre 0 y 100
        if(porcentaje < 0) porcentaje = 0;
        if(porcentaje > 100) porcentaje = 100;

        // Calcula el nuevo precio (Ejemplo: 200 * (1 - 0.25))
        const nuevoPrecio = Math.round(this.precio * (1 - porcentaje / 100));

        return new Producto (this.nombre, nuevoPrecio, this.rareza, this.tipo, this.bonus);

    }
}