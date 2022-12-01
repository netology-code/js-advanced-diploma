import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

jest.mock('../GamePlay');
beforeEach(() => jest.resetAllMocks());

test('Метод load должен выбросить ошибку', () => {
  const stateService = new GameStateService(null);
  expect(() => stateService.load()).toThrowError(new Error('Invalid state'));
});

test('При отсувствии данных выбрасывается ошибка', () => {
  const stateService = new GameStateService(null);
  const mock = jest.fn(() => GamePlay.showError('Ошибка загрузки'));

  try {
    stateService.load();
  } catch (err) {
    mock();
  }

  expect(mock).toHaveBeenCalled();
});
