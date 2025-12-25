
export function batalla(jugador, enemigo){
    let vidaJugador = jugador.vida;
    let vidaEnemigo = enemigo.vida;

    const ataqueJugadorTotal = jugador.ataqueTotal;
    const ataqueEnemigo = enemigo.ataque;

    //Los dos se atacan hasta que uno quede sin vida
    while(vidaJugador > 0 && vidaEnemigo > 0){
        //Turno 1: Jugador ataca
        vidaEnemigo -= ataqueJugadorTotal;

        if(vidaEnemigo <= 0) break;

        //Turno 2: Enemigo ataca
        const vidaProxima = vidaJugador + jugador.defensaTotal - ataqueEnemigo;
        vidaJugador = Math.max(0, vidaProxima);

    }

    //Comprobar si el jugador ganó
    const ganoJugador = vidaJugador > 0 && vidaEnemigo <= 0;
    let puntosGanados = 0;

    if(ganoJugador) {
       puntosGanados = enemigo.calcularPuntosDerrota();

       jugador.ganarPuntos(puntosGanados);

    }

    jugador.vida = vidaJugador;

    return {
        ganador: ganoJugador ? jugador.nombre : enemigo.nombre, 
        puntosGanados,
    };


}