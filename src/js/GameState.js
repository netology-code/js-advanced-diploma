import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import PositionedCharacter from "./PositionedCharacter";

export default class GameState {
  constructor(
    maxPoints = 0,
    focusedCell,
    charactersPositions = [],
    points = 0,
    focusedCharacter,
    theme
  ) {
    this.maxPoints = maxPoints;
    this.focusedCell = focusedCell;
    this.charactersPositions = charactersPositions;
    this.points = points;
    this.focusedCharacter = focusedCharacter;
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Daemon, Undead, Vampire];
    this.theme = theme;
  }

  toJSON() {
    function getClassName(obj) {
      return {
        obj: obj,
        className: obj[Symbol.toStringTag],
      };
    }
    const charactersPositionsToJSON = [];
    this.charactersPositions.forEach((el) => {
      charactersPositionsToJSON.push({
        character: getClassName(el.character),
        position: el.position,
      });
    });

    const gameStateIsJSON = {
      maxPoints: this.maxPoints,
      focusedCell: this.focusedCell,
      points: this.points,
      theme: this.theme,
      charactersPositionsToJSON: charactersPositionsToJSON,
      focusedCharacterToJSON:
        this.focusedCharacter !== undefined && this.focusedCharacter !== null
          ? {
              characterToJSON: getClassName(this.focusedCharacter.character),
              position: this.focusedCharacter.position,
              positionXY: this.focusedCharacter.positionXY,
              posibleMoves: this.focusedCharacter.posibleMoves,
              posibleAttacks: this.focusedCharacter.posibleAttacks,
            }
          : this.focusedCharacter,
    };
    return gameStateIsJSON;
  }

  static from(object) {
    function createClass(obj) {
      const typesChar = [Bowman, Swordsman, Magician, Daemon, Undead, Vampire];
      const func = typesChar.find((el) => el.name === obj.className);
      return new func(obj.obj.level, obj.obj.health);
    }

    const charactersPositionsFromJSON = [];
    object.charactersPositionsToJSON.forEach((el) =>
      charactersPositionsFromJSON.push(
        new PositionedCharacter(createClass(el.character), el.position)
      )
    );
    const focusedCharacterFromJSON =
      object.focusedCharacterToJSON !== undefined &&
      object.focusedCharacterToJSON !== null
        ? {
            character: createClass(
              object.focusedCharacterToJSON.characterToJSON
            ),
            position: object.focusedCharacterToJSON.position,
            positionXY: object.focusedCharacterToJSON.positionXY,
            posibleMoves: object.focusedCharacterToJSON.posibleMoves,
            posibleAttacks: object.focusedCharacterToJSON.posibleAttacks,
          }
        : object.focusedCharacterToJSON;

    return new GameState(
      object.maxPoints,
      object.focusedCell,
      charactersPositionsFromJSON,
      object.points,
      focusedCharacterFromJSON,
      object.theme
    );
  }
}
