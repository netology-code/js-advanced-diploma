/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
import { randomFromRange } from './utils';
import GamePlay from './GamePlay';
import GameState from './GameState';
import GameStateService from './GameStateService';
import Team from './Team';
import characterGenerator from './generators';
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
    this.isEventsBlocked = true;
    this.isMoveValid = false;
    this.isAttackValid = false;
    this.gameState = new GameState();
    this.gamePlay.drawUi(Array.from(themes)[0]);

    // create team for player & computer
    this.userPlayerTeam = new Team(this.userPlayerTypes, characterGenerator);
    this.userPlayerTeam.addRandomChar(1, this.gamePlay.initialNumberOfChars);
    this.compPlayerTeam = new Team(this.compPlayerTypes, characterGenerator);
    this.compPlayerTeam.addRandomChar(1, this.gamePlay.initialNumberOfChars);

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

    return index < boardSize ? index * boardSize + shift : (index - boardSize) * boardSize + 1 + shift;
  }

  onNewGame() {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены что хотите начать новую игру?')) {
      return;
    }
    this.init();
  }

  onLoadGame() {
    const state = this.gameStateService.load();

    this.gameState.setState(state);

    this.userPlayerTeam = new Team(
      this.userPlayerTypes,
      characterGenerator,
      this.getCharactersFromPositionedCaracters(),
    );
    this.compPlayerTeam = new Team(
      this.compPlayerTypes,
      characterGenerator,
      this.getCharactersFromPositionedCaracters(),
    );

    this.gamePlay.drawUi(Array.from(themes)[this.gameState.currentLevel - 1]);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    this.gamePlay.renderScore(this.gameState.score);

    this.isEventsBlocked = false;
  }

  onSaveGame() {
    if (this.isEventsBlocked) {
      return;
    }
    this.gameStateService.save(GameState.from(this.gameState));
  }

  // cell event handlers

  onCellClick(index) {
    if (this.isEventsBlocked) {
      return;
    }
    const character = this.getCharInPositionByIndex(index);

    if (!this.gameState.selected && character) { // клик на персонаже и нет выбранного персонажа
      if (this.userPlayerTeam.isOwnCharacter(character)) { // если свой персонаж -> выбрать его
        this.gameState.selected = character;
        this.gamePlay.selectCell(index);

        return;
      }
      GamePlay.showError('Это не ваш персонаж!'); // если не свой персонаж -> ошибка
      return;
    }
    if (this.gameState.selected && this.userPlayerTeam.isOwnCharacter(character)) { // клик на персонаже и
      const selectedIndex = this.getIndexByChar(this.gameState.selected);
      this.gamePlay.deselectCell(selectedIndex); // есть выбранный персонаж -> выбрать нажатого
      this.gameState.selected = character;
      this.gamePlay.selectCell(index);
      return;
    }
    if (!(this.isAttackValid || this.isMoveValid)) { // клик на ячейке на которую нельзя перейти и некого атаковать
      GamePlay.showError('Не допустимое действие!');
      return;
    }
    if (this.isMoveValid) { // движение персонажа игрока
      this.isEventsBlocked = true;

      this.gamePlay.setCursor(cursors.notallowed);
      this.deselectCharCells(index);
      this.moveCharacterToIndex(this.gameState.selected, index);
      this.gameState.selected = null;
      this.enemyTurn();

      this.isEventsBlocked = false;
      return;
    }
    if (this.isAttackValid) { // атака персонажа компьютера игроком
      this.isEventsBlocked = true;

      this.gamePlay.setCursor(cursors.notallowed);
      this.deselectCharCells(index);
      this.attackHandler(this.gameState.selected, this.getCharInPositionByIndex(index))
        .then(isNextLevel => {
          this.gameState.selected = null;
          if (isNextLevel) {
            this.toNextLevel();
          } else {
            this.enemyTurn();

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

    if (character) { // указатель на каком-то персонаже
      this.setTooltipOnCharacter(index);
    }

    if (this.userPlayerTeam.isOwnCharacter(character)) { // указатель на персонаже игрока
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }
    // указатель на персонаже компьютера и есть выделенный персонаж игрока
    if (this.compPlayerTeam.isOwnCharacter(character) && this.gameState.selected) {
      if (this.isValidAttackArea(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
        this.isAttackValid = true;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      return;
    }

    if (!character && this.gameState.selected) { // указатель на пустой клетке и есть выделенный персонаж игрока
      if (this.isValidMoveArea(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
        this.isMoveValid = true;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      return;
    }

    this.gamePlay.setCursor(cursors.notallowed); // все оставшиеся случаи
  }

  onCellLeave(index) {
    if (this.isEventsBlocked) {
      return;
    }

    const character = this.getCharInPositionByIndex(index);

    this.hideTooltipOnCharacter(index);
    this.gamePlay.setCursor(cursors.auto);
    this.isAttackValid = false;
    this.isMoveValid = false;
    if (!this.userPlayerTeam.isOwnCharacter(character)) {
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

  // getPositionedCharByIndex(index) {
  //   const positionedChar = this.gameState.positionedCharacters.find(o => o.position === index);

  //   return positionedChar;
  // }

  getIndexByChar(char) { // to fix
    return this.getPositionedCharByChar(char).position;
  }

  getCharactersFromPositionedCaracters() {
    return this.gameState.positionedCharacters.map(item => item.character);
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
    const radius = this.gameState.selected.attackRange;
    const selectedIndex = this.getIndexByChar(this.gameState.selected);
    const [xTarget, yTarget] = this.getXYbyIndex(index);
    const [xChar, yChar] = this.getXYbyIndex(selectedIndex);

    return xTarget >= xChar - radius && xTarget <= xChar + radius
      && yTarget >= yChar - radius && yTarget <= yChar + radius;
  }

  isValidMoveArea(index) {
    const radius = this.gameState.selected.moveRange;
    const selectedIndex = this.getIndexByChar(this.gameState.selected);
    const [xTarget, yTarget] = this.getXYbyIndex(index);
    const [xChar, yChar] = this.getXYbyIndex(selectedIndex);

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
      const damage = Math.round(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
      const index = this.getIndexByChar(target);

      // eslint-disable-next-line no-param-reassign
      target.health = target.health - damage < 0 ? 0 : target.health - damage;

      if (this.userPlayerTeam.isOwnCharacter(attacker)) {
        this.gameState.score += damage;
        this.gamePlay.renderScore(this.gameState.score);
      }

      this.gamePlay.showDamage(index, damage.toFixed())
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

  deselectCharCells(index) {
    const selectedIndex = this.getIndexByChar(this.gameState.selected);

    this.gamePlay.deselectCell(selectedIndex);
    this.gamePlay.deselectCell(index);
  }

  enemyTurn() {
    return new Promise(resolve => {
      this.doTurn();
      // setTimeout(resolve, 1000);
      this.isEventsBlocked = false;
      resolve();
    });
  }

  doTurn() {
    const opponents = this.getCloseInFightOpponents() || this.getDistanceFightOpponent();

    if (opponents) { // если в зоне досягаемости есть соперник, то атакуем его
      const { char, target } = opponents;

      this.attackHandler(char, target)
        .then(isNextLevel => {
          if (isNextLevel) {
            this.toNextLevel();
          }
        });
      return;
    }
    this.compCharMove(); // иначе движемся в сторону соперника
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

      return { char, target };
    }
    return null;
  }

  compCharMove() {
    const char = this.sortCharsBy([...this.compPlayerTeam.characters], 'moveRange')[0];
    const targets = this.getClosestTargetsInArea(char);
    const target = this.sortCharsBy(targets, 'moveRange')[0];
    const { boardSize } = this.gamePlay;
    let maxRange = char.moveRange;
    let x;
    let y;
    const [xC, yC] = this.getXYbyIndex(this.getIndexByChar(char));
    const [xT, yT] = this.getXYbyIndex(this.getIndexByChar(target));

    const angle = Math.atan2(xT - xC, yT - yC);
    const roundedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);

    do {
      x = Math.round(Math.sin(roundedAngle) * maxRange);
      y = Math.round(Math.cos(roundedAngle) * maxRange);
      maxRange -= 1;
    } while (xC + x < 0
      || yC + y < 0
      || xC + x >= boardSize
      || yC + y >= boardSize
      || this.getCharInPositionByIndex(this.getIndexByXY(xC + x, yC + y)));

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

        if (target && this.userPlayerTeam.isOwnCharacter(target)) {
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
    this.gamePlay.renderScore(this.gameState.score);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);

    this.isEventsBlocked = false;
  }

  addNewCharsToTeam(count) {
    const countOfNewUserChars = this.gamePlay.initialNumberOfChars + count - this.userPlayerTeam.count;
    const countOfNewCompChars = this.gamePlay.initialNumberOfChars + count - this.compPlayerTeam.count;

    this.userPlayerTeam.addRandomChar(1, countOfNewUserChars);
    this.compPlayerTeam.addRandomChar(1, countOfNewCompChars);
  }

  gameOver() {
    const hiScore = this.gameStateService.loadHiScore();

    alert(`Игра окончена. Вы набрали ${this.gameState.score} очков.\n Рекорд ${hiScore} очков`);
    if (this.gameState.score > hiScore) {
      this.gameStateService.saveHiScore(this.gameState.score);
    }
  }
}
