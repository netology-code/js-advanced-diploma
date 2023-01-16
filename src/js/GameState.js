import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";

export default class GameState {
  constructor(
    move = "player",
    focusedCell,
    charactersPositions = [],
    points,
    maxPoints,
    selectedCharacter
  ) {
    this.move = move;
    this.focusedCell = focusedCell;
    this.charactersPositions = charactersPositions;
    this.points = points;
    this.maxPoints = maxPoints;
    this.selectedCharacter = selectedCharacter;
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Daemon, Undead, Vampire];
  }

  changeMove() {
    this.move = this.move === "player" ? "computer" : "player";
  }

  static from(object) {
    return new GameState(
      object.move,
      object.focusedCell,
      object.charactersPositions,
      object.points,
      object.maxPoints,
      object.selectCharacter,
      object.playerTypes,
      object.enemyTypes
    );
  }
}
