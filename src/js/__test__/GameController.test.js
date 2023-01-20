import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import GameController from "../GameController";
import GameState from "../GameState";
import PositionedCharacter from "../PositionedCharacter";
import Team from "../Team";
import GameStateService from "../GameStateService";

test("focusedCharacter", () => {
  const expectings = {
    character: new Bowman(),
    position: 29,
    positionXY: { x: 5, y: 3 },
    posibleMoves: [13, 15, 20, 21, 22, 27, 30, 31, 36, 37, 43, 45, 47],
    posibleAttacks: [38, 46],
  };
  const gamePlay = { boardSize: 8 };
  const gameCtrl = new GameController(gamePlay);
  gameCtrl.gameState = new GameState();
  gameCtrl.gameState.charactersPositions = [
    new PositionedCharacter(new Bowman(), 11),
    new PositionedCharacter(new Bowman(), 39),
    new PositionedCharacter(new Bowman(), 28),
    new PositionedCharacter(new Daemon(), 38),
    new PositionedCharacter(new Daemon(), 46),
    new PositionedCharacter(new Daemon(), 54),
  ];
  const pCharacter = new PositionedCharacter(new Bowman(), 29);
  gameCtrl.focusCharacter(pCharacter);
  expect(gameCtrl.gameState.focusedCharacter).toEqual(expectings);
});

test("positionTeam", () => {
  const gamePlay = { boardSize: 8 };
  const gameCtrl = new GameController(gamePlay);
  gameCtrl.gameState = new GameState();
  gameCtrl.positionTeam(
    new Team([new Bowman(), new Bowman(), new Bowman()]),
    [1, 2]
  );
  expect(gameCtrl.gameState.charactersPositions).toHaveLength(3);
});

test("removeCharacter", () => {
  const gamePlay = { boardSize: 8 };
  const character = new Bowman();
  const gameCtrl = new GameController(gamePlay);
  gameCtrl.gameState = new GameState();
  gameCtrl.gameState.charactersPositions = [
    new PositionedCharacter(character, 10),
  ];
  gameCtrl.remove(character);
  expect(gameCtrl.gameState.charactersPositions).toHaveLength(0);
});

test("getEnemyCharacter", () => {
  const enemy = new Daemon();
  const expecting = new PositionedCharacter(enemy, 22);
  const gameCtrl = new GameController({});
  gameCtrl.gameState = new GameState();
  gameCtrl.gameState.charactersPositions = [new PositionedCharacter(enemy, 22)];
  const result = gameCtrl.getEnemyCharacter();
  expect(result).toEqual(expecting);
});

test("randomTarget return false", () => {
  const target = new GameController({}).randomTarget([]);
  expect(target).toBe(false);
});

test("moveCharacter", () => {
  const gamePlay = {
    boardSize: 8,
    redrawPositions() {},
    drawUi() {}
  };
  const stateService = new GameStateService(localStorage);
  const pCharacter = new PositionedCharacter(new Bowman(), 10);
  const gameCtrl = new GameController(gamePlay, stateService);
  gameCtrl.gameState = new GameState();
  gameCtrl.setTheme();
  gameCtrl.gameState.charactersPositions = [pCharacter];
  gameCtrl.moveCharacter(pCharacter, 20);
  console.log(gameCtrl.gameState.charactersPositions)
  // expect(gameCtrl.hasCharacter(20).character).toEqual(pCharacter.character);
  expect(gameCtrl.hasCharacter(10)).toBe(false);
});
