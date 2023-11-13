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

jest.mock('../js/GameState', () => ({
  state: {},
  from(object) {
    this.state = object;
  },
}));

jest
  .spyOn(GameController.prototype, 'loadGame')
  /* eslint-disable-next-line */
  .mockImplementation(function () {
    try {
      GameState.from(this.stateService.load());
    } catch (error) {
      GamePlay.showError(error.message);
    }
  });

const gamePlay = new GamePlay();

const stateService = new GameStateService();

const gameCtrl = new GameController(gamePlay, stateService);

test('test property load', () => {
  gameCtrl.loadGame();
  const result = GameState.state.response;
  expect(result).toBe('ответ');
});
