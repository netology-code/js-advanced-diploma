import GameState from "../GameState";
import GameStateService from "../GameStateService";
import Bowman from "../characters/Bowman";
import Swordsman from "../characters/Swordsman";
import Magician from "../characters/Magician";
import Daemon from "../characters/Daemon";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";

test("save GameState", () => {
  const expectings =
    '{"maxPoints":100,"focusedCell":23,"points":10,"theme":"prairie","charactersPositionsToJSON":[]}';

  const state = new GameState(100, 23, [], 10, undefined, "prairie");
  const stateJSON = GameState.toJSON(state);
  const stateService = new GameStateService(localStorage);
  stateService.save(stateJSON);
  const result = stateService.storage.__STORE__.state;
  expect(result).toEqual(expectings);
});

test("save GameState with custom name", () => {
  const expectings =
    '{"maxPoints":100,"focusedCell":23,"points":10,"theme":"prairie","charactersPositionsToJSON":[]}';

  const state = new GameState(100, 23, [], 10, undefined, "prairie");
  const name = "saving";
  const stateJSON = GameState.toJSON(state);
  const stateService = new GameStateService(localStorage);
  stateService.save(stateJSON, name);
  const result = stateService.storage.__STORE__[name];
  expect(result).toEqual(expectings);
});

test("load GameState", () => {
  const expectings = {
    charactersPositions: [],
    enemyTypes: [Daemon, Undead, Vampire],
    focusedCell: 23,
    focusedCharacter: undefined,
    maxPoints: 100,
    playerTypes: [Bowman, Swordsman, Magician],
    points: 10,
    theme: "prairie",
  };

  const state = new GameState(100, 23, [], 10, undefined, "prairie");
  const stateJSON = GameState.toJSON(state);
  const stateService = new GameStateService(localStorage);
  stateService.save(stateJSON);
  const resultJSON = stateService.load();
  const result = GameState.from(resultJSON);
  expect(result).toEqual(expectings);
});

test("load GameState with custom name", () => {
  const expectings = {
    charactersPositions: [],
    enemyTypes: [Daemon, Undead, Vampire],
    focusedCell: 23,
    focusedCharacter: undefined,
    maxPoints: 100,
    playerTypes: [Bowman, Swordsman, Magician],
    points: 10,
    theme: "prairie",
  };

  const state = new GameState(100, 23, [], 10, undefined, "prairie");
  const name = "saving";
  const stateJSON = GameState.toJSON(state);
  const stateService = new GameStateService(localStorage);
  stateService.save(stateJSON, name);
  const resultJSON = stateService.load(name);
  const result = GameState.from(resultJSON);
  expect(result).toEqual(expectings);
});

test("error for invalid state", () => {
  const expecting = new Error("Invalid state");
  const badJSON = '{"foo": 1,}';
  const stateService = new GameStateService(localStorage);
  stateService.storage.setItem("state", badJSON);
  expect(stateService.load).toThrow(expecting);
});
