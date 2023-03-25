/* eslint-disable no-continue */
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
    this.isEventsBlocked = true;

    this.registerEventListeners();

    // TODO: load saved stated from stateService

    this.positionedCharacters = [];

    // create team for player & computer
    this.userPlayerTeam = generateTeam(this.userPlayerTypes, 1, this.gamePlay.initialCountOfChars);
    this.compPlayerTeam = generateTeam(this.compPlayerTypes, 1, this.gamePlay.initialCountOfChars);

    // place characters on board
    this.placeUserTeamOnBoard();
    this.placeCompTeamOnBoard();

    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.isEventsBlocked = false;
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
    if (this.isEventsBlocked) {
      return;
    }
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
      this.moveUserCharacterToIndex(index)
        .then(() => {
          this.enemyTurn.call(this);
          console.log('user turn');
          this.isEventsBlocked = false;
        });
        // .then(() => {
        //   console.log('user turn');
        //   this.isEventsBlocked = false;
        // });
    }
    if (this.gameState.isAttackValid) {
      console.log('attacking enemy');

      this.isEventsBlocked = true;
      this.gamePlay.setCursor(cursors.notallowed);
      this.attackEnemyByIndex(index)
        .then(() => {
          this.enemyTurn.call(this);
          console.log('user turn');
          this.isEventsBlocked = false;
        });
        // .then(() => {
        //   console.log('next turn');
        //   this.isEventsBlocked = false;
        // });
    }
  }

  onCellEnter(index) {
    if (this.isEventsBlocked) {
      return;
    }
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
    if (this.isEventsBlocked) {
      return;
    }
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

  getPositionedCharByChar(character) { // TO FIX !!!!
    const positionedChar = this.positionedCharacters.find(o => o.character === character);

    return positionedChar;
  }

  getPositionedCharByIndex(index) {
    const positionedChar = this.positionedCharacters.find(o => o.position === index);

    return positionedChar;
  }

  getIndexByChar(char) { // to fix
    return this.getPositionedCharByChar(char).position;
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
    const [xTarget, yTarget] = this.getXYbyIndex(index);
    const [xChar, yChar] = this.getXYbyIndex(this.gameState.selected.index);

    return xTarget >= xChar - radius && xTarget <= xChar + radius
      && yTarget >= yChar - radius && yTarget <= yChar + radius;
  }

  isValidMoveArea(index) {
    const radius = this.gameState.selected.character.moveRange;
    const [xTarget, yTarget] = this.getXYbyIndex(index);
    const [xChar, yChar] = this.getXYbyIndex(this.gameState.selected.index);

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

  getXYbyIndex(index) {
    const { boardSize } = this.gamePlay;
    const x = index % boardSize;
    const y = Math.floor(index / boardSize);
    return [x, y];
  }

  getIndexByXY(x, y) {
    return y * 8 + x;
  }

  moveUserCharacterToIndex(index) {
    return new Promise(resolve => {
      this.isEventsBlocked = true;
      this.gamePlay.setCursor(cursors.notallowed);
      const positionedChar = this.getPositionedCharByIndex(this.gameState.selected.index);

      this.resetSelectedCharacter();
      this.gamePlay.deselectCell(index);
      positionedChar.position = index;
      this.gamePlay.redrawPositions(this.positionedCharacters);
      resolve(); // next turn
    });
  }

  attackEnemyByIndex(index) {
    return new Promise(resolve => {
      const attacker = this.gameState.selected.character;
      const target = this.getCharInPositionByIndex(index);
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);

      target.health = target.health - damage < 0 ? 0 : target.health - damage;

      this.resetSelectedCharacter();
      this.gamePlay.deselectCell(index);
      this.gamePlay.showDamage(index, damage)
        .then(() => {
          if (!target.health) {
            console.log(target, ' is dead');
            console.log(this.positionedCharacters);
            this.removeCharFromPositionedChars(target);
            this.compPlayerTeam.remove(target);
            console.log(this.positionedCharacters);
          }
          this.gamePlay.redrawPositions(this.positionedCharacters);
          resolve(); // next turn
        });
    });
  }

  attackUser(attacker, target) {
    return new Promise(resolve => {
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      const index = this.getIndexByChar(target);

      // eslint-disable-next-line no-param-reassign
      target.health = target.health - damage < 0 ? 0 : target.health - damage;

      this.gamePlay.showDamage(index, damage)
        .then(() => {
          if (!target.health) {
            console.log(target, ' is dead');
            console.log(this.positionedCharacters);
            this.removeCharFromPositionedChars(target);
            this.userPlayerTeam.remove(target);
            console.log(this.positionedCharacters);
          }
          this.gamePlay.redrawPositions(this.positionedCharacters);
          resolve(); // next turn
        });
    });
  }

  isDead(char) {
    return char.health <= 0;
  }

  removeCharFromPositionedChars(char) {
    const index = this.positionedCharacters.findIndex(item => item.character === char);
    // console.log(position, index);
    this.positionedCharacters.splice(index, 1);
  }

  resetSelectedCharacter() {
    this.gamePlay.deselectCell(this.gameState.selected.index);
    this.gameState.selected.character = null;
    this.gameState.selected.index = null;
  }

  enemyTurn() {
    return new Promise(resolve => {
      console.log('enemy turn');
      this.doTurn();
      // setTimeout(resolve, 1000);
      this.isEventsBlocked = false;
      resolve();
    });
  }

  doTurn() {
    const rangedChars = this.rangeCharsByAttack([...this.compPlayerTeam.characters]);

    for (const char of rangedChars) {
      const targets = this.getTargetsInAdjacentCell(char);
      if (!targets.length) {
        continue;
      }
      const rangedTargets = this.rangeCharsByDefence(targets);
      const target = rangedTargets[rangedTargets.length - 1];
      console.log('attacking char: ', char);
      console.log('target char: ', target);
      this.attackUser(char, target)
        .then(() => {
          console.log('user turn');
          this.isEventsBlocked = false;
        });
      return;
    }
    // console.log(this.compPlayerTeam.characters, rangedChars);
  }

  rangeCharsByAttackRange(rangedChars) {
    rangedChars.sort((char1, char2) => char2.attackRange - char1.attackRange);
    return rangedChars;
  }

  rangeCharsByAttack(rangedChars) {
    rangedChars.sort((char1, char2) => char2.attack - char1.attack);
    return rangedChars;
  }

  rangeCharsByDefence(rangedChars) {
    rangedChars.sort((char1, char2) => char2.defence - char1.defence);
    return rangedChars;
  }

  getTargetsInAdjacentCell(char) {
    const { boardSize } = this.gamePlay;
    const [x, y] = this.getXYbyIndex(this.getIndexByChar(char));
    const targets = [];

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i === boardSize || j === boardSize || i < 0 || j < 0 || (i === x && j === y)) {
          continue;
        }
        const index = this.getIndexByXY(i, j);
        const target = this.getCharInPositionByIndex(index);

        if (target && this.isUserCharacter(target)) {
          targets.push(target);
        }
      }
    }
    return targets;
  }
}
