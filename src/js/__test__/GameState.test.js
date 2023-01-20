import GameState from "../GameState";
import Bowman from "../characters/Bowman";
import GameController from "../GameController";
import PositionedCharacter from "../PositionedCharacter";

test("GameState.toJSON throw error for GameState", () => {
  const expecting = new Error("Передан некорректный GameState");
  expect(GameState.toJSON.bind(this, {})).toThrow(expecting);
});

test("getClassName of GameState.toJSON return {obj, className}", () => {
  const expectings = {
    obj: new Bowman(),
    className: "Bowman",
  };
  const gamePlay = { boardSize: 8 };
  const gameCtrl = new GameController(gamePlay);
  gameCtrl.gameState = new GameState();
  const pCharacter = new PositionedCharacter(new Bowman(), 29);
  gameCtrl.focusCharacter(pCharacter);
  const result = GameState.toJSON(gameCtrl.gameState);
  expect(result.focusedCharacterToJSON.characterToJSON).toEqual(expectings);
});
