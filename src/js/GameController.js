/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
import { generateTeam, randomFromRange } from './generators';
import GamePlay from './GamePlay';
import GameState from './GameState';
import GameStateService from './GameStateService';
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
    this.gameStateService = new GameStateService(localStorage);

    this.registerEventListeners();
  }

  registerEventListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
  }

  init() {
    this.gameState = new GameState();
    this.gamePlay.drawUi(Array.from(themes)[0]);
    this.isEventsBlocked = true;

    // TODO: load saved stated from stateService

    // create team for player & computer
    this.userPlayerTeam = generateTeam(this.userPlayerTypes, 1, this.gamePlay.initialNumberOfChars);
    this.compPlayerTeam = generateTeam(this.compPlayerTypes, 1, this.gamePlay.initialNumberOfChars);

    // place characters on board
    this.placeUserTeamOnBoard();
    this.placeCompTeamOnBoard();

    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    this.isEventsBlocked = false;
  }

  placeUserTeamOnBoard() {
    const positions = this.getInitialPositions('user', this.userPlayerTeam.count);

    this.userPlayerTeam.characters.forEach((character, index) => {
      this.gameState.positionedCharacters.push(new PositionedCharacter(character, positions[index]));
    });
  }

  placeCompTeamOnBoard() {
    const positions = this.getInitialPositions('comp', this.compPlayerTeam.count);

    this.compPlayerTeam.characters.forEach((character, index) => {
      this.gameState.positionedCharacters.push(new PositionedCharacter(character, positions[index]));
    });
  }

  getInitialPositions(playerType, count) {
    const positions = [];
    let counter = 0;

    while (counter < count) {
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

  onNewGame() {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены что хотите начать новую игру?')) {
      return;
    }
    console.log('new game');
    this.init();
  }

  onLoadGame() {
    const state = this.gameStateService.load();
    this.gameState.setState(state);
    console.log('load', state);
    this.gamePlay.drawUi(Array.from(themes)[this.gameState.currentLevel - 1]);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    this.gamePlay.renderScore(this.gameState.score);
    if (this.gameState.selected.character) {
      this.gamePlay.selectCell(this.gameState.selected.index);
    }
    this.isEventsBlocked = false;
  }

  onSaveGame() {
    if (this.isEventsBlocked) {
      return;
    }
    console.log('save');
    this.gameStateService.save(GameState.from(this.gameState));
  }

  // cell event handlers

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
      this.isEventsBlocked = true;
      this.gamePlay.setCursor(cursors.notallowed);
      this.gamePlay.deselectCell(index);
      this.moveCharacterToIndex(this.gameState.selected.character, index);
      this.resetSelectedCharacter();
      this.enemyTurn();
      console.log('user turn');
      this.isEventsBlocked = false;
      return;
    }
    if (this.gameState.isAttackValid) {
      console.log('attacking enemy');
      this.isEventsBlocked = true;
      this.gamePlay.setCursor(cursors.notallowed);
      this.gamePlay.deselectCell(index);
      this.attackHandler(this.gameState.selected.character, this.getCharInPositionByIndex(index))
        .then(isNextLevel => {
          this.resetSelectedCharacter();
          if (isNextLevel) {
            this.toNextLevel();
          } else {
            this.enemyTurn.call(this);
            console.log('user turn', isNextLevel);
            this.isEventsBlocked = false;
          }
        });
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
    const positionedChar = this.gameState.positionedCharacters.find(o => o.position === index);

    return positionedChar === undefined ? null : positionedChar.character;
  }

  getPositionedCharByChar(character) {
    const positionedChar = this.gameState.positionedCharacters.find(o => o.character === character);

    return positionedChar;
  }

  getPositionedCharByIndex(index) {
    const positionedChar = this.gameState.positionedCharacters.find(o => o.position === index);

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

    // Diagonal check
    for (let x = xChar - radius, y1 = yChar - radius, y2 = yChar + radius; x <= xChar + radius; x++, y1++, y2--) {
      if ((xTarget === x && yTarget === y1) || (xTarget === x && yTarget === y2)) {
        return true;
      }
    }

    const horizontalCheck = yTarget === yChar && xTarget >= xChar - radius && xTarget <= xChar + radius;
    const verticalCheck = xTarget === xChar && yTarget >= yChar - radius && yTarget <= yChar + radius;

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

  moveCharacterToIndex(char, index) {
    const positionedChar = this.getPositionedCharByChar(char);

    positionedChar.position = index;
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }

  attackHandler(attacker, target) {
    return new Promise(resolve => {
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      const index = this.getIndexByChar(target);

      // eslint-disable-next-line no-param-reassign
      target.health = target.health - damage < 0 ? 0 : target.health - damage;

      if (this.isUserCharacter(attacker)) {
        this.gameState.score += damage;
        this.gamePlay.renderScore(this.gameState.score);
      }

      this.gamePlay.showDamage(index, damage)
        .then(() => {
          if (target.isDead()) {
            this.removeCharFromTeam(target);
          }

          const isNextLevel = this.compPlayerTeam.isEmpty() || this.userPlayerTeam.isEmpty();

          this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
          resolve(isNextLevel); // next turn
        });
    });
  }

  removeCharFromTeam(char) {
    const index = this.gameState.positionedCharacters.findIndex(item => item.character === char);

    this.gameState.positionedCharacters.splice(index, 1);
    this.compPlayerTeam.remove(char);
    this.userPlayerTeam.remove(char);
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
    const opponents = this.getCloseInFightOpponents() || this.getDistanceFightOpponent();

    if (opponents) {
      const { char, target } = opponents;
      this.attackHandler(char, target)
        .then(isNextLevel => {
          if (isNextLevel) {
            this.toNextLevel();
          } else {
            console.log('user turn', isNextLevel);
            this.isEventsBlocked = false;
          }
        });
      return;
    }
    this.compCharMove();
  }

  getCloseInFightOpponents() {
    const sortedChars = this.sortCharsBy([...this.compPlayerTeam.characters], 'attack');

    for (const char of sortedChars) {
      const targets = this.getAllTargetsInArea(char, 1);
      if (!targets.length) {
        continue;
      }
      const sortedTargets = this.sortCharsBy(targets, 'defence');
      const target = sortedTargets[sortedTargets.length - 1];
      console.log('Close-In  -  attacking char: ', char, ' target char: ', target);

      return { char, target };
    }
    return null;
  }

  getDistanceFightOpponent() {
    const sortedChars = this.sortCharsBy([...this.compPlayerTeam.characters], 'attackRange');

    for (const char of sortedChars) {
      const { attackRange } = char;
      const targets = this.getAllTargetsInArea(char, attackRange);
      if (!targets.length) {
        continue;
      }
      const sortedTargets = this.sortCharsBy(targets, 'defence');
      const target = sortedTargets[sortedTargets.length - 1];
      console.log('Distant  -  attacking char: ', char, ' target char: ', target);

      return { char, target };
    }
    return null;
  }

  compCharMove() {
    console.log('Moving char: ');
    const char = this.sortCharsBy([...this.compPlayerTeam.characters], 'moveRange')[0];
    const targets = this.getClosestTargetsInArea(char);
    const target = this.sortCharsBy(targets, 'moveRange')[0];
    const maxRange = char.moveRange;

    const [xC, yC] = this.getXYbyIndex(this.getIndexByChar(char));
    const [xT, yT] = this.getXYbyIndex(this.getIndexByChar(target));

    console.log((xT - xC), (yT - yC));
    const angle = Math.atan2(xT - xC, yT - yC);
    const roundedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    console.log(target, angle * (180 / Math.PI), roundedAngle * (180 / Math.PI));
    const x = Math.round(Math.sin(roundedAngle) * maxRange);
    const y = Math.round(Math.cos(roundedAngle) * maxRange);
    console.log(x, y);
    const index = this.getIndexByXY(xC + x, yC + y);
    this.moveCharacterToIndex(char, index);
  }

  sortCharsBy(chars, sortBy) {
    chars.sort((char1, char2) => char2[sortBy] - char1[sortBy]);
    return chars;
  }

  getAllTargetsInArea(char, radius) {
    const { boardSize } = this.gamePlay;
    const [x, y] = this.getXYbyIndex(this.getIndexByChar(char));
    const targets = [];

    for (let i = x - radius; i <= x + radius; i++) {
      for (let j = y - radius; j <= y + radius; j++) {
        if (i >= boardSize || j >= boardSize || i < 0 || j < 0 || (i === x && j === y)) {
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

  getClosestTargetsInArea(char) {
    const { boardSize } = this.gamePlay;
    const [x, y] = this.getXYbyIndex(this.getIndexByChar(char));
    const radius = Math.max(x, y, boardSize - x - 1, boardSize - y - 1);

    for (let r = 2; r <= radius; r++) {
      const targets = this.getAllTargetsInArea(char, r);
      if (targets.length) {
        return targets;
      }
    }
    return null;
  }

  toNextLevel() {
    this.isEventsBlocked = true;
    if (this.gameState.currentLevel++ === 4) {
      this.gameOver();
      return;
    }

    for (const char of this.userPlayerTeam.characters) {
      char.levelUp();
    }
    for (const char of this.compPlayerTeam.characters) {
      char.levelUp();
    }

    this.gameState.positionedCharacters = [];

    this.gamePlay.drawUi(Array.from(themes)[this.gameState.currentLevel - 1]);
    this.addNewCharsToTeam(this.gameState.currentLevel - 1);
    this.placeUserTeamOnBoard();
    this.placeCompTeamOnBoard();
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);

    this.isEventsBlocked = false;
  }

  addNewCharsToTeam(count) {
    const countOfNewUserChars = this.gamePlay.initialNumberOfChars + count - this.userPlayerTeam.count;
    const countOfNewCompChars = this.gamePlay.initialNumberOfChars + count - this.compPlayerTeam.count;

    const newUserPlayerChars = generateTeam(this.userPlayerTypes, 1, countOfNewUserChars).characters;
    const newCompPlayerChars = generateTeam(this.compPlayerTypes, 1, countOfNewCompChars).characters;

    this.userPlayerTeam.characters = this.userPlayerTeam.characters.concat(newUserPlayerChars);
    this.compPlayerTeam.characters = this.compPlayerTeam.characters.concat(newCompPlayerChars);
  }

  gameOver() {
    alert('game over');
  }
}
