export class jugador{
    nombre;
    avatar;
    puntos;
    inventario;
    vidaMax;
    vida;
    ataqueBase;
    defensaBase;

    constructor(nombre, ataqueBase = 0, defensaBase = 0, vidaInicial = 100){
        this.nombre = nombre;
        this.avatar = './image/player.png';
        this.puntos = 0;
        this.inventario = [];
        this.ataqueBase = ataqueBase;
        this.defensaBase = defensaBase;
        this.vidaMax = vidaInicial;
        this.vida = this.vidaMax;

    }

    añadirItem(item){
        this.inventario.push(structuredClone(item));
    }

    ganarPuntos(cantidad){
        this.puntos += cantidad
    }

    get ataqueTotal(){
        return this.ataqueBase + this.inventario.reduce((total, item) =>
        total + (item.tipo === 'Arma' ? item.bonus : 0), 0);
    }

    get defensaTotal(){
        return this.defensaBase + this.inventario.reduce((total, item) =>
        total + (item.tipo === 'Armadura' ? item.bonus: 0), 0);
    }

    get vidaTotal(){
        const bonusVida = this.inventario.reduce((total, item)=>
        total + (item.tipo === 'Consumible' ? item.bonus: 0), 0);

        return this.vidaMax + bonusVida;
    }

}