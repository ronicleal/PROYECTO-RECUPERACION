/**
 * Representa al jugador dentro del juego, gestionando sus estadísticas,
 * inventario y recursos económicos.
 * @class
 */
export class Jugador{
    nombre;
    avatar;
    puntos;
    inventario;
    vidaMax;
    vida;
    ataqueBase;
    defensaBase;
    dinero;

    /**
     * Crea una instancia de Jugador.
     * @param {string} nombre - El nombre elegido por el usuario.
     * @param {number} [ataqueBase=0] - Ataque inicial otorgado en la creación.
     * @param {number} [defensaBase=0] - Defensa inicial otorgada en la creación.
     * @param {number} [vidaInicial=100] - Vida máxima inicial.
     * @param {number} [dineroInicial=500] - Dinero inicial disponible.
     */
    constructor(nombre, ataqueBase = 0, defensaBase = 0, vidaInicial = 100, dineroInicial = 500){
        this.nombre = nombre;
        this.avatar = './image/player.png';
        this.puntos = 0;
        this.inventario = [];
        this.ataqueBase = ataqueBase;
        this.defensaBase = defensaBase;
        this.vidaMax = vidaInicial;
        this.vida = this.vidaMax;
        this.dinero = dineroInicial;

    }

    /**
     * Añade un objeto al inventario realizando una copia profunda.
     * @param {Object} item - El objeto a añadir (debe tener tipo y bonus).
     */
    añadirItem(item){
        this.inventario.push(structuredClone(item));
    }

    /**
     * Incrementa la puntuación del jugador.
     * @param {number} cantidad - Puntos a sumar.
     */
    ganarPuntos(cantidad){
        this.puntos += cantidad
    }

    /**
     * Intenta realizar un cobro al jugador.
     * @param {number} cantidad - Coste a deducir.
     * @returns {boolean} True si la transacción fue exitosa, False si no hay fondos suficientes.
     */
    gastarDinero(cantidad){
        if(this.dinero >= cantidad){
            this.dinero -= cantidad;
            return true;
        }

        return false;
    }

    /**
     * Calcula el ataque total sumando la base y el bonus de todas las armas en el inventario.
     * @type {number}
     * @readonly
     */
    get ataqueTotal(){
        return this.ataqueBase + this.inventario.reduce((total, item) =>
        total + (item.tipo === 'Arma' ? item.bonus : 0), 0);
    }

    /**
     * Calcula la defensa total sumando la base y el bonus de todas las armaduras en el inventario.
     * @type {number}
     * @readonly
     */
    get defensaTotal(){
        return this.defensaBase + this.inventario.reduce((total, item) =>
        total + (item.tipo === 'Armadura' ? item.bonus: 0), 0);
    }

    /**
     * Calcula la vida máxima total sumando la base y los bonus de salud de los consumibles.
     * @type {number}
     * @readonly
     */
    get vidaTotal(){
        const bonusVida = this.inventario.reduce((total, item)=>
        total + (item.tipo === 'Consumible' ? item.bonus: 0), 0);

        return this.vidaMax + bonusVida;
    }

}