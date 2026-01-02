/**
 * Representa a un oponente básico dentro del juego.
 * @class
 */
export class Enemigo {
    nombre;
    ataque;
    vida;
    tipo;

    /**
     * Crea una instancia de Enemigo.
     * @param {string} nombre - Nombre identificativo del enemigo.
     * @param {number} ataque - Poder de ataque base.
     * @param {number} vida - Salud inicial del enemigo.
     */
    constructor(nombre, ataque, vida){
        this.nombre = nombre;
        this.ataque = ataque;
        this.vida = vida;
        this.tipo = 'enemigo';
    }

    /**
     * Calcula la recompensa en puntos al derrotar a este enemigo.
     * @returns {number} Puntos totales obtenidos.
     */
    calcularPuntosDerrota(){
        return 100 + this.ataque;
    }


}

/**
 * Representa a un oponente de élite con bonificadores de puntuación.
 * @class
 * @extends Enemigo
 */
export class Jefe extends Enemigo {
    multiplicador;

    /**
     * Crea una instancia de Jefe.
     * @param {string} nombre - Nombre del jefe.
     * @param {number} ataque - Poder de ataque base.
     * @param {number} vida - Salud inicial del jefe.
     * @param {number} [multiplicador=1.2] - Bono multiplicador para los puntos de derrota.
     */
    constructor (nombre, ataque, vida, multiplicador= 1.2) {
        super(nombre, ataque, vida);
        this.tipo = 'jefe';
        this.multiplicador = multiplicador;
    }

    /**
     * Calcula la recompensa en puntos aplicando el multiplicador de jefe.
     * @override
     * @returns {number} Puntos totales redondeados hacia abajo.
     */
    calcularPuntosDerrota(){
        const puntosBase = super.calcularPuntosDerrota();
        return Math.floor(puntosBase * this.multiplicador);
    }

}