import { EUR } from "../utils/utils.js";

export class Producto{
    nombre;
    precio;
    rareza;
    tipo;
    bonus;

    constructor(nombre, precio, rareza, tipo, bonus){
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

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


    aplicarDescuento(porcentaje){
        // Limita el porcentaje entre 0 y 100
        if(porcentaje < 0) porcentaje = 0;
        if(porcentaje > 100) porcentaje = 100;

        // Calcula el nuevo precio (Ejemplo: 200 * (1 - 0.25))
        const nuevoPrecio = Math.round(this.precio * (1 - porcentaje / 100));

        return new Producto (this.nombre, nuevoPrecio, this.rareza, this.tipo, this.bonus);

    }
}