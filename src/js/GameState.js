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
    getTheme
  ) {
    this.focusedCell = focusedCell;
    this.charactersPositions = charactersPositions;
    this.points = points;
    this.maxPoints = maxPoints;
    this.selectedCharacter = selectedCharacter;
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Daemon, Undead, Vampire];
    this.getTheme = getTheme;
  }

  static from(object) {
    console.log(object.charactersPositions);
    const charactersPositions = object.charactersPositions.map(
      (character) =>
        new PositionedCharacter(character.character, character.position)
    );

    return new GameState(
      object.focusedCell,
      charactersPositions,
      object.points,
      object.maxPoints,
      object.selectedCharacter,
      object.playerTypes,
      object.enemyTypes,
      object.getTheme
    );
  }
}
