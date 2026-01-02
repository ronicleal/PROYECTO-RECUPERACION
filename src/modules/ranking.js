import { groupBy } from "../utils/utils.js";

/**
 * Ejecuta un combate automático por turnos entre el jugador y un enemigo.
 * El combate continúa en un bucle hasta que la vida de uno de los dos llega a cero.
 * @param {Jugador} jugador - Instancia del jugador con sus estadísticas y equipo.
 * @param {Enemigo|Jefe} enemigo - Instancia del oponente (puede ser enemigo común o jefe).
 * @returns {Object} Resultado del encuentro.
 * @property {string} ganador - El nombre del personaje que sobrevivió al combate.
 * @property {number} puntosGanados - Puntos de experiencia obtenidos (0 si el jugador pierde).
 * @property {number} dineroExtra - Monedas ganadas (5 por enemigos, 10 por jefes; 0 si pierde).
 */
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


/**
 * Clasifica una lista de jugadores en dos categorías basadas en su puntuación.
 * Utiliza una función de agrupación externa (groupBy).
 * * @param {Jugador[]} jugadores - Array de instancias de jugadores a clasificar.
 * @param {number} [umbral=300] - Puntos necesarios para ser considerado 'Veterano'.
 * @returns {Object.<string, Jugador[]>} Objeto con las llaves 'Veterano' y 'Novato' que contienen arrays de jugadores.
 */
export function agruparPorNivel(jugadores, umbral = 300){
    return groupBy(jugadores, jugador => (jugador.puntos >= umbral ? 'Veterano' : 'Novato'));
}