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
    this.selectedCharacter = null;
    this.board = {
      cells: this.gamePlay.boardSize ** 2,
      board: (() => {
        let arr = [];
        for (let n = 0; n < this.gamePlay.boardSize; n += 1) {
          let row = [];
          for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
            row.push(i + n * this.gamePlay.boardSize);
          }
          arr.push(row);
        }
        return arr;
      })(),
    };
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
    if (character && this.isPlayer(character.character)) {
      if (this.choseCell !== undefined) {
        this.gamePlay.deselectCell(this.choseCell);
      }

      this.choseCell = index;
      this.gamePlay.selectCell(index);
      this.selectedCharacter = character;
    } else if (character && !this.isPlayer(character.character)) {
      GamePlay.showError("Выберите персонажа Игрока");
    }

    console.log(this.selectCharacter(this.getCharacter(index)));
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const character = this.getCharacter(index);
    if (character) {
      const { level, attack, defence, health } = character.character;
      this.gamePlay.showCellTooltip(
        `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`,
        index
      );

      if (this.isPlayer(character.character)) {
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
    if (this.selectedCharacter && this.selectedCharacter.position === index) {
      return;
    } else {
      this.gamePlay.deselectCell(index);
    }
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
        new PositionedCharacter(character, this.getRandomPosition(allowedCells))
      );
    });
  }

  getRandomPosition(allowedCells) {
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
    return character ? character : false;
  }

  isPlayer(character) {
    return this.playerTypes.some((type) => character instanceof type);
  }

  selectCharacter({ character, position }) {
    const y = Math.round(position / this.gamePlay.boardSize);
    const x = position % this.gamePlay.boardSize;

    const posibleAttacks = [];
    const posibleMoves = [];
    const start = (i, attibute) => {
      return i - attibute >= 0 ? i - attibute : 0;
    };
    const end = (i, attibute) => {
      return i + attibute <= this.gamePlay.boardSize
        ? i + attibute
        : this.gamePlay.boardSize;
    };
    for (
      let i = start(y, character.attackRange);
      i <= end(y, character.attackRange);
      i += 1
    ) {
      for (
        let n = start(x, character.attackRange);
        n <= end(x, character.attackRange);
        n += 1
      ) {
        const cell = i * this.gamePlay.boardSize + n;
        if (cell !== position) {
          posibleAttacks.push(cell);
        }
      }
    }
    for (
      let i = start(y, character.moveRange);
      i <= end(y, character.moveRange);
      i += 1
    ) {
      for (
        let n = start(x, character.moveRange);
        n <= end(x, character.moveRange);
        n += 1
      ) {
        const cell = i * this.gamePlay.boardSize + n;
        if (y - x === i - n && cell !== position) {
          posibleMoves.push(cell);
        } else if (y + x === i + n && cell !== position) {
          posibleMoves.push(cell);
        }
      }
    }

    return {
      character,
      position,
      positionXY: { x, y },
      posibleMoves,
      posibleAttacks,
    };
  }
}
