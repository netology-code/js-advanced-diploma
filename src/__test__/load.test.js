import GameStateService from '../js/GameStateService';
import GamePlay from '../js/GamePlay';
import GameController from '../js/GameController';
import GameState from '../js/GameState';

/* eslint-disable-next-line */
jest.mock('../js/GameStateService', () => function () {
  return {
    load: () => ({ response: 'ответ' }),
  };
});

/* eslint-disable-next-line */
jest.mock('../js/GameState', () => function () {
  return {
    response: null,
    from(object) {
      this.response = object.response;
    },
  };
});

jest
  .spyOn(GameController.prototype, 'loadGame')
  /* eslint-disable-next-line */
  .mockImplementation(function () {
    try {
      this.gameState.from(this.stateService.load());
    } catch (error) {
      GamePlay.showError(error.message);
    }
  });

const gamePlay = new GamePlay();

const stateService = new GameStateService();

const gameCtrl = new GameController(gamePlay, stateService);

gameCtrl.gameState = new GameState();

test('test property load', () => {
  gameCtrl.loadGame();
  const result = gameCtrl.gameState.response;
  expect(result).toBe('ответ');
});
