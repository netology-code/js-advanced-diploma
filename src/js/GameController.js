/* eslint-disable class-methods-use-this */
import { generateTeam, randomFromRange } from './generators';
import GamePlay from './GamePlay';
import GameState from './GameState';
import themes from './themes';
import cursors from './cursors';
import PositionedCharacter from './PositionedCharacter';
import {
  Bowman, Swordsman, Magician, Vampire, Undead, Daemon,
} from './Characters/Characters';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.userPlayerTypes = [Bowman, Swordsman, Magician];
    this.compPlayerTypes = [Vampire, Undead, Daemon];
  }

  init() {
    this.gameState = new GameState();
    this.gamePlay.drawUi(themes.prairie);

    // TODO: add event listeners to gamePlay events
    this.registerEventListeners();

    // TODO: load saved stated from stateService

    this.positionedCharacters = [];

    // create team for player & computer
    this.userPlayerTeam = generateTeam(this.userPlayerTypes, 1, this.gamePlay.initialCountOfChars);
    this.compPlayerTeam = generateTeam(this.compPlayerTypes, 1, this.gamePlay.initialCountOfChars);

    // place characters on board
    this.placeUserTeamOnBoard();
    this.placeCompTeamOnBoard();

    // reDrawPositions
    this.gamePlay.redrawPositions(this.positionedCharacters);

    // console.log(this.positionedCharacters[0].character);
  }

  registerEventListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  placeUserTeamOnBoard() {
    const positions = this.getInitialPositions('user');

    this.userPlayerTeam.characters.forEach((character, index) => {
      this.positionedCharacters.push(new PositionedCharacter(character, positions[index]));
    });
  }

  placeCompTeamOnBoard() {
    const positions = this.getInitialPositions('comp');

    this.compPlayerTeam.characters.forEach((character, index) => {
      this.positionedCharacters.push(new PositionedCharacter(character, positions[index]));
    });
  }

  getInitialPositions(playerType) {
    const positions = [];
    let counter = 0;
    while (counter < this.gamePlay.initialCountOfChars) {
      const position = playerType === 'user' ? this.getRandomUserCharPosition() : this.getRandomCompCharPosition();

      if (!positions.includes(position)) {
        positions.push(position);
        counter += 1;
      }
    }
    return positions;
  }

  getRandomUserCharPosition() {
    return this.getRandomCellInTwoColumns(0);
  }

  getRandomCompCharPosition() {
    return this.getRandomCellInTwoColumns(this.gamePlay.boardSize - 2);
  }

  getRandomCellInTwoColumns(shift) {
    const { boardSize } = this.gamePlay;
    const index = randomFromRange(0, boardSize * 2 - 1);

    if (index < boardSize) {
      return index * boardSize + shift;
    }
    return (index - boardSize) * boardSize + 1 + shift;
  }

  onCellClick(index) {
    const character = this.getCharInPositionByIndex(index);

    if (!this.gameState.selected.character && character) {
      if (this.isUserCharacter(character)) {
        this.gameState.selected.character = character;
        this.gameState.selected.index = index;
        this.gamePlay.selectCell(index);
        return;
      }
      GamePlay.showError('Это не ваш персонаж!');
      return;
    }
    if (this.gameState.selected.character && this.isUserCharacter(character)) {
      this.gamePlay.deselectCell(this.gameState.selected.index);
      this.gameState.selected.character = character;
      this.gameState.selected.index = index;
      this.gamePlay.selectCell(index);
      return;
    }
    if (!(this.gameState.isAttackValid || this.gameState.isMoveValid)) {
      GamePlay.showError('Не допустимое действие!');
      return;
    }
    if (this.gameState.isMoveValid) {
      this.moveUserCharacterToIndex(index);
      return;
    }
    if (this.gameState.isAttackValid) {
      console.log('attack enemy');
      return;
    }
  }

  onCellEnter(index) {
    const character = this.getCharInPositionByIndex(index);

    if (character) {
      this.setTooltipOnCharacter(index);
    }

    if (this.isUserCharacter(character)) {
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    if (character && !this.isUserCharacter(character) && this.gameState.selected.character) {
      if (this.isValidAttackArea(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
        this.gameState.isAttackValid = true;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      return;
    }

    if (character && !this.isUserCharacter(character) && !this.gameState.selected.character) {
      this.gamePlay.setCursor(cursors.notallowed);
      return;
    }

    if (!character && this.gameState.selected.character) {
      if (this.isValidMoveArea(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
        this.gameState.isMoveValid = true;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      return;
    }

    this.gamePlay.setCursor(cursors.notallowed);
  }

  onCellLeave(index) {
    const character = this.getCharInPositionByIndex(index);

    this.hideTooltipOnCharacter(index);
    this.gamePlay.setCursor(cursors.auto);
    this.gameState.isAttackValid = false;
    this.gameState.isMoveValid = false;
    if (!this.isUserCharacter(character)) {
      this.gamePlay.deselectCell(index);
    }
  }

  getCharInPositionByIndex(index) {
    const positionedChar = this.positionedCharacters.find(o => o.position === index);

    return positionedChar === undefined ? null : positionedChar.character;
  }

  getPositionedCharByChar(character) {
    const positionedChar = this.positionedCharacters.find(o => o.character === character);

    return positionedChar;
  }

  isUserCharacter(character) {
    return this.userPlayerTypes.reduce((result, item) => result || (character instanceof item), false);
  }

  setTooltipOnCharacter(index) {
    const {
      level, attack, defence, health,
    } = this.getCharInPositionByIndex(index);
    const tooltip = `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;

    this.gamePlay.showCellTooltip(tooltip, index);
  }

  hideTooltipOnCharacter(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  isValidAttackArea(index) {
    const radius = this.gameState.selected.character.attackRange;
    const [xTarget, yTarget] = this.getXY(index);
    const [xChar, yChar] = this.getXY(this.gameState.selected.index);

    return xTarget >= xChar - radius && xTarget <= xChar + radius
      && yTarget >= yChar - radius && yTarget <= yChar + radius;
  }

  isValidMoveArea(index) {
    const radius = this.gameState.selected.character.moveRange;
    const [xTarget, yTarget] = this.getXY(index);
    const [xChar, yChar] = this.getXY(this.gameState.selected.index);

    const horizontalCheck = yTarget === yChar && xTarget >= xChar - radius && xTarget <= xChar + radius;
    const verticalCheck = xTarget === xChar && yTarget >= yChar - radius && yTarget <= yChar + radius;

    // Diagonal check
    for (let x = xChar - radius, y1 = yChar - radius, y2 = yChar + radius; x <= xChar + radius; x++, y1++, y2--) {
      if ((xTarget === x && yTarget === y1) || (xTarget === x && yTarget === y2)) {
        return true;
      }
    }

    return horizontalCheck || verticalCheck;
  }

  getXY(index) {
    const x = index % 8;
    const y = Math.floor(index / 8);
    return [x, y];
  }

  moveUserCharacterToIndex(index) {
    const positionedChar = this.getPositionedCharByChar(this.gameState.selected.character);

    positionedChar.position = index;
    this.gamePlay.deselectCell(this.gameState.selected.index);
    this.gamePlay.deselectCell(index);
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gameState.selected.character = null;
    this.gameState.selected.index = null;
  }
}
