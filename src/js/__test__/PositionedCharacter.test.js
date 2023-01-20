import PositionedCharacter from "../PositionedCharacter";
import Bowman from "../characters/Bowman";

test.each([
  [
    {},
    10,
    new Error("character must be instance of Character or its children"),
  ],
  [new Bowman(), "10", new Error("position must be a number")],
])(
  "new PositionedCharacter(%i, %i) return %s",
  (character, position, error) => {
    function newPCharacter() {
      const result = new PositionedCharacter(character, position);
      return result;
    }
    expect(newPCharacter).toThrow(error);
  }
);
