import Bowman from '../Characters/Bowman';
import cursors from '../cursors';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import PositionedCharacter from '../PositionedCharacter';
import Swordsman from '../Characters/Swordsman';
import Vampire from '../Characters/Vampire';
import GameStateService from '../GameStateService';
import Daemon from '../Characters/Daemon';

const posVampire = new PositionedCharacter(new Vampire(1), 30);
const posSwordsman = new PositionedCharacter(new Swordsman(1), 1);
const posBowman = new PositionedCharacter(new Bowman(1), 24);
const posDaemon = new PositionedCharacter(new Daemon(1), 33);
const stateService = new GameStateService();
const testCtrl = new GameController(new GamePlay(), stateService);
testCtrl.gameState.allPositions.push(posBowman, posSwordsman, posVampire, posDaemon);
testCtrl.gamePlay.selectCell = jest.fn();
testCtrl.gamePlay.setCursor = jest.fn();
GamePlay.showError = jest.fn();
testCtrl.gamePlay.hideCellTooltip = jest.fn();
testCtrl.gamePlay.showCellTooltip = jest.fn();
testCtrl.gamePlay.getAttack = jest.fn();

test('Если в ячейке есть персонаж игрока, то курсор = pointer', () => {
  testCtrl.onCellEnter(24);
  expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});

test('Если перемещение доступно, подсвечивает ячейку и курсор = pointer', () => {
  testCtrl.gameState.selected = 1;
  testCtrl.onCellEnter(10);
  expect(testCtrl.gamePlay.selectCell).toHaveBeenCalledWith(10, 'green');
  expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});

test('Если персонаж выбран и диапазон валидный, то при наведении на бота курсор = crosshair', () => {
  testCtrl.gameState.selected = 24;
  testCtrl.onCellEnter(33);
  expect(testCtrl.gamePlay.selectCell).toHaveBeenCalledWith(33, 'red');
});

test('Если персонаж выбран, но не валидный диапазон, то курсор = notallowed', () => {
  testCtrl.gameState.selected = 24;
  testCtrl.onCellEnter(62);
  expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
});

test('Если в ячейке есть персонаж игрока,  выделяется ячейку', () => {
  testCtrl.onCellClick(24);
  expect(testCtrl.gamePlay.selectCell).toBeCalled();
});

test('Если в ячейке персонаж компьютера, показывает сообщение об ошибке', () => {
  testCtrl.onCellClick(33);
  expect(testCtrl.gamePlay.selectCell).toBeCalled();
});

test('Метод onCellLeave вызывает hideCellTooltip и курсор = auto', () => {
  testCtrl.onCellLeave(24);
  expect(testCtrl.gamePlay.hideCellTooltip).toBeCalled();
  expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.auto);
});

test('Метод calcRange должен вернуть корректное значение', () => {
  const bowman = new Bowman(1);
  const bowDist = bowman.distance;
  const bowAttackRange = bowman.attackRange;
  const received = [40, 24, 48, 16, 33, 25, 41, 34, 18, 50];
  expect(testCtrl.calcRange(32, bowDist)).toEqual(received);
  expect(testCtrl.calcRange(32, bowAttackRange)).toEqual(received);
});
