import { addPlayer, startGameLoop, state, setDirection, displayState} from './game'

addPlayer('p1', 'Alice')
addPlayer('p2', 'Bob')

const p1 = state.players['p1']
const p2 = state.players['p2']

if (p1 && p1.body[0]) {
  p1.body[0].x = 500
  p1.body[0].y = 500
}

if (p2 && p2.body[0]) {
  p2.body[0].x = 900
  p2.body[0].y = 500
}

// directions fixes pour observer le déplacement sans collision entre joueurs
setDirection('p1', 'RIGHT')
setDirection('p2', 'RIGHT')

// place une nourriture devant p1 pour forcer un event eaten rapidement
if (state.foods[0]) {
  state.foods[0].x = 510
  state.foods[0].y = 500
}

// démarrer la boucle de jeu et afficher résumé à chaque tick
startGameLoop(displayState)//je lance la boucle avec la fonction qui affiche les infos