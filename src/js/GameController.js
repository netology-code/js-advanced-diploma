import themes from "./themes";
import cursors from "./cursors";
import { generateTeam } from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";
import GameState from "./GameState";
import AI from "./AI";
import selectCharacter from "./selectCharacter";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    // TODO: load saved stated from stateService
    if (this.stateService.load()) {
      this.gameState = GameState.from(this.stateService.load());
    } else {
      this.gameState = new GameState();
    }

    const playerTeam = generateTeam(this.gameState.playerTypes, 3, 4);
    this.positionTeam(playerTeam, [1, 2]);

    const enemyTeam = generateTeam(this.gameState.enemyTypes, 3, 4);
    this.positionTeam(enemyTeam, [7, 8]);

    this.gamePlay.redrawPositions(this.gameState.charactersPositions);

    // const ai = new AI(this.gameState);
    // ai.move();
  }

  onCellClick(index) {
    // TODO: react to click
    const character = this.getCharacter(index);
    if (character && this.isPlayer(character.character)) {
      if (this.gameState.focusedCell !== undefined) {
        this.gamePlay.deselectCell(this.gameState.focusedCell);
      }

      this.gameState.focusedCell = index;
      this.gamePlay.selectCell(index);
      this.gameState.selectedCharacter = selectCharacter.call(this, character);
    } else if (character && !this.isPlayer(character.character)) {
      if (
        this.gameState.selectedCharacter &&
        this.gameState.selectedCharacter.posibleAttacks.includes(index)
      ) {
        this.attack(character);
      } else {
        GamePlay.showError("Выберите персонажа Игрока");
      }
    } else if (!character && this.gameState.selectedCharacter) {
      if (
        !this.isPlayer(character.character) &&
        this.gameState.selectedCharacter.posibleMoves.includes(index)
      ) {
        this.moveCharacter(this.gameState.selectedCharacter, index);
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

    if (this.gameState.selectedCharacter && !character) {
      if (this.gameState.selectedCharacter.posibleMoves.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, "green");
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (
      this.gameState.selectedCharacter &&
      !this.isPlayer(character.character)
    ) {
      if (this.gameState.selectedCharacter.posibleAttacks.includes(index)) {
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
    if (
      this.gameState.selectedCharacter &&
      this.gameState.selectedCharacter.position === index
    ) {
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
      this.gameState.charactersPositions.push(
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
    const character = this.gameState.charactersPositions.find(
      (char) => char.position === position
    );
    return character ? character : false;
  }

  isPlayer(character) {
    return this.gameState.playerTypes.some((type) => character instanceof type);
  }

  isSameTeam(character1, character2) {
    const character1IsPlayer = this.gameState.playerTypes.some(
      (type) => character1 instanceof type
    )
      ? "player"
      : "enemy";
    const character2IsPlayer = this.gameState.playerTypes.some(
      (type) => character2 instanceof type
    )
      ? "player"
      : "enemy";

    if (character1IsPlayer === character2IsPlayer) {
      return true;
    } else {
      return false;
    }
  }

  moveCharacter(character, index) {
    this.getCharacter(character.position).position = index;
    this.gamePlay.redrawPositions(this.gameState.charactersPositions);

    this.gameState.selectedCharacter = null;
    this.gamePlay.deselectCell(character.position);
    this.gameState.nextMove();
    console.log(this.gameState);
  }

  async attack(target) {
    const attacker = this.gameState.selectedCharacter.character;
    const damage = Math.max(
      attacker.attack - target.character.defence,
      attacker.attack * 0.1
    );

    target.character.health -= damage;
    await this.gamePlay.showDamage(target.position, damage);
    this.gamePlay.redrawPositions(this.gameState.charactersPositions);
  }
}
