import Bowman from '../Characters/Bowman';
import cursors from '../cursors';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import PositionedCharacter from '../PositionedCharacter';
import Team from '../Team';
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
const arr = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const arr1 = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
testCtrl.gameState.allPositions.push(posBowman, posSwordsman, posVampire, posDaemon);
testCtrl.gamePlay.selectCell = jest.fn();
testCtrl.gamePlay.setCursor = jest.fn();
GamePlay.showError = jest.fn();
testCtrl.gamePlay.hideCellTooltip = jest.fn();
testCtrl.gamePlay.showCellTooltip = jest.fn();
testCtrl.gamePlay.getAttack = jest.fn();

test('метод getUserCharPositions должен вернуть массив стартовых позиций персонажа', () => {
  const arrTest = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
  expect(testCtrl.getUserStartPositions()).toEqual(arrTest);
  expect(testCtrl.getUserStartPositions().length).toBe(16);
});

test('метод getUserStartPositions должна вернуть массив стартовых позиций бота', () => {
  const arrTest = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
  expect(testCtrl.getBotStartPositions()).toEqual(arrTest);
  expect(testCtrl.getBotStartPositions().length).toBe(16);
});

test('метод getRandomPosition должен вернуть один из элементов массива', () => {
  expect(arr).toContain(testCtrl.getRandom(arr));
  expect(arr1).not.toContain(testCtrl.getRandom(arr));
});

test('метод addsTheTeamToPosition должен добавить команду в gameState.allPositions', () => {
  const bowman = new Bowman(1);
  const swordsman = new Swordsman(1);
  const userTeam = new Team();
  userTeam.addAll([bowman, swordsman]);
  testCtrl.addsTheTeamToPosition(userTeam, arr);
  expect(testCtrl.gameState.allPositions.length).toBe(6);
});

test('метод getChar должен вернуть персонажа по индексу', () => {
  expect(testCtrl.getChar(1)).toEqual(posSwordsman);
  expect(testCtrl.getChar(24)).toEqual(posBowman);
  expect(testCtrl.getChar(30)).toEqual(posVampire);
});

test('метод isUserChar должен проверить наличие персонажа игрока по индексу', () => {
  expect(testCtrl.isUserChar(24)).toBeTruthy();
  expect(testCtrl.isUserChar(30)).toBeFalsy();
  expect(testCtrl.isUserChar(1)).toBeTruthy();
});

test('метод isBotChar должен проверить наличие персонажа бота по индексу', () => {
  expect(testCtrl.isBotChar(24)).toBeFalsy();
  expect(testCtrl.isBotChar(30)).toBeTruthy();
  expect(testCtrl.isBotChar(1)).toBeFalsy();
});

test('Если в ячейке есть персонаж игрока, то курсор = pointer', () => {
  testCtrl.onCellEnter(24);
  expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});

test('Если перемещение доступно, onCellEnter подсвечивает ячейку и курсор = pointer', () => {
  testCtrl.gameState.selected = 1;
  testCtrl.onCellEnter(10);
  expect(testCtrl.gamePlay.selectCell).toHaveBeenCalledWith(10, 'green');
  expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});

test('Если в ячейке персонаж, при наведении показывается инфо о персонаже', () => {
  const char = posVampire.character;
  const mes = `\u{1F396}${char.level}\u{2694}${char.attack}\u{1F6E1}${char.defence}\u{2764}${char.health}`;
  testCtrl.onCellEnter(30);
  expect(testCtrl.gamePlay.showCellTooltip).toHaveBeenCalledWith(mes, 30);
});

test('Если персонаж выбран и валидный диапазон атаки, то при наведении на бота курсор = crosshair', () => {
  testCtrl.gameState.selected = 24;
  testCtrl.onCellEnter(33);
  expect(testCtrl.gamePlay.selectCell).toHaveBeenCalledWith(33, 'red');
});

test('Если персонаж выбран, но не валидный диапазон для атаки и перемещения, то курсор = notallowed', () => {
  testCtrl.gameState.selected = 24;
  testCtrl.onCellEnter(62);
  expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
});

test('Если в ячейке есть персонаж игрока, onCellClick выделяет ячейку', () => {
  testCtrl.onCellClick(24);
  expect(testCtrl.gamePlay.selectCell).toBeCalled();
});

test('Если в ячейке персонаж бота, onCellClick показывает сообщение об ошибке', () => {
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
