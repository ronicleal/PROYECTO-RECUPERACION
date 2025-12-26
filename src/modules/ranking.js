import { groupBy } from "../utils/utils.js";

export function batalla(jugador, enemigo){
    let vidaJugador = jugador.vida;
    let vidaEnemigo = enemigo.vida;

    //Los dos se atacan hasta que uno quede sin vida
    while(vidaJugador > 0 && vidaEnemigo > 0){
        //Turno 1: Jugador ataca
        vidaEnemigo = vidaEnemigo - jugador.ataqueTotal;

        if(vidaEnemigo <= 0) break;

        //Turno 2: Enemigo ataca
        let nuevaVida = (vidaJugador + jugador.defensaTotal) - enemigo.ataque;

        if(nuevaVida > vidaJugador){
            vidaJugador = vidaJugador - 1;
        }else{
            vidaJugador = nuevaVida;
        }

        if(vidaJugador < 0) vidaJugador = 0;

    }

    //Comprobar si el jugador ganó
    const ganoJugador = vidaJugador > 0 && vidaEnemigo <= 0;
    let puntosGanados = 0;
    let dineroExtra = 0;

    if(ganoJugador) {
       puntosGanados = enemigo.calcularPuntosDerrota();
       jugador.ganarPuntos(puntosGanados);

       //Dinero Extra 5 para normales y 10 para jefe
       dineroExtra = (enemigo.tipo === 'jefe') ? 10 : 5;
       jugador.dinero += dineroExtra;

    }

    jugador.vida = vidaJugador;

    return {
        ganador: ganoJugador ? jugador.nombre : enemigo.nombre, 
        puntosGanados,
        dineroExtra
    };


}



export function agruparPorNivel(jugadores, umbral = 300){
    return groupBy(jugadores, jugador => (jugador.puntos >= umbral ? 'Veterano' : 'Novato'));
}