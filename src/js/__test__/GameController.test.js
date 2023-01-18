import Bowman from '../characters/Bowman';
import GameController from '../GameController';
import GameState from '../GameState';
import PositionedCharacter from '../PositionedCharacter';

test('focusedCharacter', () => {
  const expectings = {
    character: {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
    position: 29,
    positionXY: { x: 5, y: 3 },
    posibleMoves: [11, 13, 15, 20, 21, 22, 27, 28, 30, 31, 36, 37, 38, 43, 45, 47],
    posibleAttacks: [],
  };
  const gamePlay = { boardSize: 8 };
  const gameCtrl = new GameController(gamePlay);
  gameCtrl.gameState = new GameState();
  const character = new Bowman();
  const pCharacter = new PositionedCharacter(character, 29);
  const result = gameCtrl.focusCharacter(pCharacter);
  expect(result).toEqual(expectings);
});
