import themes from "./themes";
import cursors from "./cursors";
import { generateTeam } from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";
import GameState from "./GameState";

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
    if (this.stateService.load()) {
      this.gameState = GameState.from(this.stateService.load());
    } else {
      this.gameState = new GameState({});
    }
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
      this.selectedCharacter = this.selectCharacter(character);
    } else if (character && !this.isPlayer(character.character)) {
      if (
        this.selectedCharacter &&
        this.selectedCharacter.posibleAttacks.includes(index)
      ) {
        this.attack(character);
      } else {
        GamePlay.showError("Выберите персонажа Игрока");
      }
    } else if (!character && this.selectedCharacter) {
      if (
        !this.isPlayer(character.character) &&
        this.selectedCharacter.posibleMoves.includes(index)
      ) {
        this.moveCharacter(this.selectedCharacter, index);
      }
    }
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
      }
    }

    if (this.selectedCharacter && !character) {
      if (this.selectedCharacter.posibleMoves.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, "green");
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (this.selectedCharacter && !this.isPlayer(character.character)) {
      if (this.selectedCharacter.posibleAttacks.includes(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, "red");
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (!this.isPlayer(character.character)) {
      this.gamePlay.setCursor(cursors.notallowed);
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

  moveCharacter(character, index) {
    this.getCharacter(character.position).position = index;
    this.gamePlay.redrawPositions(this.charactersPositions);

    this.selectedCharacter = null;
    this.gamePlay.deselectCell(character.position);
    this.gameState.nextMove();
    console.log(this.gameState);
  }

  attack(target) {
    console.log(target.position);
    this.gamePlay.showDamage(target.position, 10).then(console.log("все"));
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
      let yMove = start(y, character.moveRange);
      yMove <= end(y, character.moveRange);
      yMove += 1
    ) {
      for (
        let xMove = start(x, character.moveRange);
        xMove <= end(x, character.moveRange);
        xMove += 1
      ) {
        const cell = yMove * this.gamePlay.boardSize + xMove;
        if (cell !== position) {
          if (y - x === yMove - xMove) {
            posibleMoves.push(cell);
          } else if (y + x === yMove + xMove) {
            posibleMoves.push(cell);
          } else if (xMove === x) {
            posibleMoves.push(cell);
          } else if (yMove === y) {
            posibleMoves.push(cell);
          }
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
