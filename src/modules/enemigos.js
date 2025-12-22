export class Enemigo{
    nombre;
    ataque;
    vida;
    tipo;

    constructor(nombre, ataque, vida){
        this.nombre = nombre;
        this.ataque = ataque;
        this.vida = vida;
        this.tipo = 'enemigo';
    }

    calcularPuntosDerrota(){
        return 100 + this.ataque;
    }


}

export class Jefe extends Enemigo {
    multiplicador;

    constructor (nombre, ataque, vida, multiplicador= 1.2) {
        super(nombre, ataque, vida);
        this.tipo = 'jefe';
        this.multiplicador = multiplicador;
    }

    calcularPuntosDerrota(){
        const puntosBase = super.calcularPuntosDerrota();
        return Math.floor(puntosBase * this.multiplicador);
    }

}