import themes from "./themes";
import cursors from "./cursors";
import { generateTeam } from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";

import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.charactersPositions = [];
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Daemon, Undead, Vampire];
    this.choseCell;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const playerTeam = generateTeam(this.playerTypes, 3, 4);
    this.positionTeam(playerTeam, [1, 2]);

    const enemyTeam = generateTeam(this.enemyTypes, 3, 4);
    this.positionTeam(enemyTeam, [7, 8]);

    this.gamePlay.redrawPositions(this.charactersPositions);

    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    const character = this.getCharacter(index);
    if (character && this.isPlayer(character)) {
      if (this.choseCell !== undefined) {
        this.gamePlay.deselectCell(this.choseCell);
      }

      this.choseCell = index;
      this.gamePlay.selectCell(index);
    } else if (character && !this.isPlayer(character)) {
      GamePlay.showError("Выберите персонажа Игрока");
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const character = this.getCharacter(index);
    if (character) {
      const { level, attack, defence, health } = character;
      this.gamePlay.showCellTooltip(
        `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`,
        index
      );

      if (this.isPlayer(character)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (!this.isPlayer(character)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, "red");
      }
    } else {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, "green");
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.deselectCell(index);
  }

  positionTeam(team, allowedColumns) {
    const allowedCells = [];

    allowedColumns.forEach((column) => {
      for (let cell = 0; cell < this.gamePlay.boardSize ** 2; cell += 1) {
        if (cell % this.gamePlay.boardSize === column - 1) {
          allowedCells.push(cell);
        }
      }
    });

    team.characters.forEach((character) => {
      this.charactersPositions.push(
        new PositionedCharacter(character, this.getPosition(allowedCells))
      );
    });
  }

  getPosition(allowedCells) {
    let position;
    do {
      position = allowedCells[Math.round(Math.random() * allowedCells.length)];
    } while (this.getCharacter(position) || position === undefined);
    return position;
  }

  getCharacter(position) {
    const character = this.charactersPositions.find(
      (char) => char.position === position
    );
    return character ? character.character : false;
  }

  // setCharacter(character, position) {
  //   const character = this.charactersPositions.find(
  //     (char) => char.character === character
  //   );
  //   character.position = position;
  // }

  isPlayer(character) {
    return this.playerTypes.some((type) => character instanceof type);
  }
}
