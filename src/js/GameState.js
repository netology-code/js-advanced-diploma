import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import PositionedCharacter from "./PositionedCharacter";

export default class GameState {
  constructor(
    focusedCell,
    charactersPositions = [],
    points = 0,
    maxPoints = 0,
    selectedCharacter,
    theme
  ) {
    this.focusedCell = focusedCell;
    this.charactersPositions = charactersPositions;
    this.points = points;
    this.maxPoints = maxPoints;
    this.selectedCharacter = selectedCharacter;
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
      focusedCell: this.focusedCell,
      points: this.points,
      maxPoints: this.maxPoints,
      theme: this.theme,
      charactersPositionsToJSON: charactersPositionsToJSON,
      selectedCharacterToJSON:
        this.selectedCharacter !== undefined && this.selectedCharacter !== null
          ? {
              characterToJSON: getClassName(this.selectedCharacter.character),
              position: this.selectedCharacter.position,
              positionXY: this.selectedCharacter.positionXY,
              posibleMoves: this.selectedCharacter.posibleMoves,
              posibleAttacks: this.selectedCharacter.posibleAttacks,
            }
          : this.selectedCharacter,
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
    const selectedCharacterFromJSON =
      object.selectedCharacterToJSON !== undefined &&
      object.selectedCharacterToJSON !== null
        ? {
            character: createClass(
              object.selectedCharacterToJSON.characterToJSON
            ),
            position: object.selectedCharacterToJSON.position,
            positionXY: object.selectedCharacterToJSON.positionXY,
            posibleMoves: object.selectedCharacterToJSON.posibleMoves,
            posibleAttacks: object.selectedCharacterToJSON.posibleAttacks,
          }
        : object.selectedCharacterToJSON;

    return new GameState(
      object.focusedCell,
      charactersPositionsFromJSON,
      object.points,
      object.maxPoints,
      selectedCharacterFromJSON,
      object.theme
    );
  }
}
