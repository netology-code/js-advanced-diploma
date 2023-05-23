import themes from './themes';
import Team from './Team';
import { generateTeam } from './generators';
import Bowman from './Characters/Bowman';
import Swordsman from './Characters/Swordsman';
import Daemon from './Characters/Daemon';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import Magician from './Characters/Magician';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.userTeam = new Team();
    this.botTeam = new Team();
    this.botCharacters = [Daemon, Undead, Vampire];
    this.userCharacters = [Bowman, Swordsman, Magician];
    this.gameState = new GameState();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.userTeam.addAll(generateTeam([Bowman, Swordsman], 1, 2));
    this.botTeam.addAll(generateTeam(this.botCharacters, 1, 2));
    this.addsTheTeamToPosition(this.userTeam, this.getUserStartPositions());
    this.addsTheTeamToPosition(this.botTeam, this.getBotStartPositions());
    this.gamePlay.redrawPositions(this.gameState.allPositions);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
    GamePlay.showMessage(`Уровень ${this.gameState.level}`);
  }

  /**
   * Функция формирует командный состав, исходя из условий каждого уровня
   */

  onCellClick(index) {
    // TODO: react to click

    if (this.gameState.level === 5 || this.userTeam.members.size === 0) {
      return;
    }

    // Реализация атаки
    if (this.gameState.selected !== null && this.getChar(index) && this.isBotChar(index)) {
      if (this.isAttack(index)) {
        this.getAttack(index, this.gameState.selected);
      }
    }

    // перемещение персонажа игрока
    if (this.gameState.selected !== null && this.isMoving(index) && !this.getChar(index)) {
      if (this.gameState.isUsersTurn) {
        this.getUsersTurn(index);
      }
    }

    // Если не валидный ход, то показываем сообщение об ошибке
    if (this.gameState.selected !== null && !this.isMoving(index) && !this.isAttack(index)) {
      if (this.gameState.isUsersTurn && !this.getChar(index)) {
        GamePlay.showError('Недопустимый ход');
      }
    }

    // Если ячейка пустая то при клике на неё return
    if (!this.getChar(index)) {
      return;
    }

    // Если клик на бота, то показываем сообщение об ошибке
    if (this.getChar(index) && this.isBotChar(index) && !this.isAttack(index)) {
      GamePlay.showError('Это не ваш персонаж');
    }

    // Если клик на персонажа игрока, то выделяем клетку желтым
    if (this.getChar(index) && this.isUserChar(index)) {
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-yellow'));
      this.gamePlay.selectCell(index);
      this.gameState.selected = index;
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter

    // Если в ячейке персонаж игрока, то при наведении на ячейку курсор = pointer
    if (this.getChar(index) && this.isUserChar(index)) {
      this.gamePlay.setCursor(cursors.pointer);
    }
    // Если валидный диапазон перемещения, то при наведении выделяем ячейку зелёным
    if (this.gameState.selected !== null && !this.getChar(index) && this.isMoving(index)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }
    // При наведении на персонажа показываем инфо
    if (this.getChar(index)) {
      const char = this.getChar(index).character;
      const message = `\u{1F396}${char.level}\u{2694}${char.attack}\u{1F6E1}${char.defence}\u{2764}${char.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
    // Если валидный диапазон атаки, то при наведении выделяем ячейку красным
    if (this.gameState.selected !== null && this.getChar(index) && !this.isUserChar(index)) {
      if (this.isAttack(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
    }
    // Если не валидные диапазоны атаки и перемещения и бот, то при наведении курсор = notallowed
    if (this.gameState.selected !== null && !this.isAttack(index) && !this.isMoving(index)) {
      if (!this.isUserChar(index)) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-red'));
    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  /**
   * Функция атаки, наносит урон противнику
   * @param {number} idx индекс бота
   * @returns после атаки пересчитывается полоска жизни над
   *  персонажем (она автоматически пересчитывается в redrawPositions).
   */
  getAttack(idx) {
    if (this.gameState.isUsersTurn) {
      const attacker = this.getChar(this.gameState.selected).character;
      const target = this.getChar(idx).character;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      if (!attacker || !target) {
        return;
      }
      this.gamePlay.showDamage(idx, damage).then(() => {
        target.health -= damage;
        if (target.health <= 0) {
          this.getDeletion(idx);
          this.botTeam.delete(target);
        }
      }).then(() => {
        this.gamePlay.redrawPositions(this.gameState.allPositions);
      }).then(() => {
        this.getGameResult();
        this.getBotsResponse();
      });
      this.gameState.isUsersTurn = false;
    }
  }

  /**
   * Функция реализует перемещение персонажа юзера в ячейку по которой был клик,
   *  если диапазон валидный
   * @param {number} idx индекс ячейки перемещения
   */
  getUsersTurn(idx) {
    this.getSelectedChar().position = idx;
    this.gamePlay.deselectCell(this.gameState.selected);
    this.gamePlay.redrawPositions(this.gameState.allPositions);
    this.gameState.selected = idx;
    this.gameState.isUsersTurn = false;
    this.getBotsResponse();
  }

  /**
   * Функция реализует ответное действие бота атаку или перемещение, в зависимости от положения
   * персонажа игрока
   * @returns наносит урон персонажу игрока, в случае атаки или рандомно выбирает бота и реализует
   *перемещение.
   */
  getBotsResponse() {
    if (this.gameState.isUsersTurn) {
      return;
    }
    const botsTeam = this.gameState.allPositions.filter((e) => (
      e.character instanceof Vampire
      || e.character instanceof Daemon
      || e.character instanceof Undead
    ));
    const usersTeam = this.gameState.allPositions.filter((e) => (
      e.character instanceof Bowman
      || e.character instanceof Swordsman
      || e.character instanceof Magician
    ));
    let bot = null;
    let target = null;

    if (botsTeam.length === 0 || usersTeam.length === 0) {
      return;
    }

    botsTeam.forEach((elem) => {
      const rangeAttack = this.calcRange(elem.position, elem.character.attackRange);
      usersTeam.forEach((val) => {
        if (rangeAttack.includes(val.position)) {
          bot = elem;
          target = val;
        }
      });
    });

    if (target) {
      const damage = Math.max(bot.character.attack - target.character.defence, bot.character.attack * 0.1);
      this.gamePlay.showDamage(target.position, damage).then(() => {
        target.character.health -= damage;
        if (target.character.health <= 0) {
          this.getDeletion(target.position);
          this.userTeam.delete(target.character);
          this.gamePlay.deselectCell(this.gameState.selected);
          this.gameState.selected = null;
        }
      }).then(() => {
        this.gamePlay.redrawPositions(this.gameState.allPositions);
        this.gameState.isUsersTurn = true;
      }).then(() => {
        this.getGameResult();
      });
    } else {
      bot = botsTeam[Math.floor(Math.random() * botsTeam.length)];
      const botRange = this.calcRange(bot.position, bot.character.distance);
      botRange.forEach((e) => {
        this.gameState.allPositions.forEach((i) => {
          if (e === i.position) {
            botRange.splice(botRange.indexOf(i.position), 1);
          }
        });
      });
      const botPos = this.getRandom(botRange);
      bot.position = botPos;

      this.gamePlay.redrawPositions(this.gameState.allPositions);
      this.gameState.isUsersTurn = true;
    }
  }

  /**
   * Функция проверяет после каждого действия пользователя или бота состояние игры
   * и в зависимости от условий переводит игру в одно из состояний: "Победа", "Поражение",
   *  "Переход на следующий уровень".
   */
  getGameResult() {
    if (this.userTeam.members.size === 0) {
      this.gameState.statistics.push(this.gameState.points);
      GamePlay.showMessage(`Вы проиграли...Количество набранных очков: ${this.gameState.points}`);
    }

    if (this.botTeam.members.size === 0 && this.gameState.level === 4) {
      this.scoringPoints();
      this.gameState.statistics.push(this.gameState.points);
      GamePlay.showMessage(`Поздравляем! Вы победили! Количество набранных очков: ${this.gameState.points},
      Максимальное количество очков: ${Math.max(...this.gameState.statistics)}`);
      this.gameState.level += 1;
    }

    if (this.botTeam.members.size === 0 && this.gameState.level <= 3) {
      this.gameState.isUsersTurn = true;
      this.scoringPoints();
      GamePlay.showMessage(`Вы прошли уровень ${this.gameState.level} Количество набранных очков: ${this.gameState.points}`);
      this.gameState.level += 1;
      this.getLevelUp();
    }
  }

  /**
   * Функция перехода на следующий уровень.
   */
  getLevelUp() {
    this.gameState.allPositions = [];
    this.userTeam.members.forEach((char) => char.levelUp());

    if (this.gameState.level === 2) {
      this.userTeam.addAll(generateTeam(this.userCharacters, 1, 1));
      this.botTeam.addAll(generateTeam(this.botCharacters, 2, this.userTeam.members.size));
    }

    if (this.gameState.level === 3) {
      this.userTeam.addAll(generateTeam(this.userCharacters, 2, 2));
      this.botTeam.addAll(generateTeam(this.botCharacters, 3, this.userTeam.members.size));
    }

    if (this.gameState.level === 4) {
      this.userTeam.addAll(generateTeam(this.userCharacters, 3, 2));
      this.botTeam.addAll(generateTeam(this.botCharacters, 4, this.userTeam.members.size));
    }

    GamePlay.showMessage(`Уровень ${this.gameState.level}`);
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.addsTheTeamToPosition(this.userTeam, this.getUserStartPositions());
    this.addsTheTeamToPosition(this.botTeam, this.getBotStartPositions());
    this.gamePlay.redrawPositions(this.gameState.allPositions);
  }

  /**
   * Функция начисления очков пользователю по завершению уровня
   */
  scoringPoints() {
    this.gameState.points += this.userTeam.toArray().reduce((a, b) => a + b.health, 0);
  }

  /**
   * Удаляет персонажа из игрового поля
   * @param {number} idx индекс персонажа
   */
  getDeletion(idx) {
    const state = this.gameState.allPositions;
    state.splice(state.indexOf(this.getChar(idx)), 1);
  }

  /**
   * Проверяет валидность диапазона перемещения
   * @param {number} idx индекс персонажа
   * @returns boolean
   */
  isMoving(idx) {
    if (this.getSelectedChar()) {
      const moving = this.getSelectedChar().character.distance;
      const arr = this.calcRange(this.gameState.selected, moving);
      return arr.includes(idx);
    }
    return false;
  }

  /**
   * Проверяет валидность диапазона атаки
   * @param {number} idx индекс персонажа
   * @returns boolean
   */
  isAttack(idx) {
    if (this.getSelectedChar()) {
      const stroke = this.getSelectedChar().character.attackRange;
      const arr = this.calcRange(this.gameState.selected, stroke);
      return arr.includes(idx);
    }
    return false;
  }

  /**
   * @returns Возвращает выбранного героя
   */
  getSelectedChar() {
    return this.gameState.allPositions.find((elem) => elem.position === this.gameState.selected);
  }

  /**
   * @returns {Array} Возвращает массив возможных позиций игрока при старте игры
   */
  getUserStartPositions() {
    const size = this.gamePlay.boardSize;
    this.userPosition = [];
    for (let i = 0, j = 1; this.userPosition.length < size * 2; i += size, j += size) {
      this.userPosition.push(i, j);
    }
    return this.userPosition;
  }

  /**
   * @returns Возвращает массив возможных позиций бота при старте игры
   */
  getBotStartPositions() {
    const size = this.gamePlay.boardSize;
    const botPosition = [];
    for (let i = size - 2, j = size - 1; botPosition.length < size * 2; i += size, j += size) {
      botPosition.push(i, j);
    }
    return botPosition;
  }

  /**
 * Возвращает рандомную позицию
 * @param {Array} positions массив возможных позиций при старте игры
 * @returns рандомное число
 */
  getRandom(positions) {
    this.positions = positions;
    return this.positions[Math.floor(Math.random() * this.positions.length)];
  }

  /**
   * Добавляет команду в gameState.allPositions
   * @param {Object} team команда (игрока или бота)
   * @param {Array} positions массив возможных позиций при старте игры
   */
  addsTheTeamToPosition(team, positions) {
    const copyPositions = [...positions];
    for (const item of team) {
      const random = this.getRandom(copyPositions);
      this.gameState.allPositions.push(new PositionedCharacter(item, random));
      copyPositions.splice(copyPositions.indexOf(random), 1);
    }
  }

  /**
   * Проверяет по индексу игрока ли персонаж
   * @param {number} idx индекс игрока
   * @returns boolean
   */
  isUserChar(idx) {
    if (this.getChar(idx)) {
      const char = this.getChar(idx).character;
      return this.userCharacters.some((elem) => char instanceof elem);
    }
    return false;
  }

  /**
   * Проверяет по индексу бота ли персонаж
   * @param {number} idx индекс бота
   * @returns boolean
   */
  isBotChar(idx) {
    if (this.getChar(idx)) {
      const bot = this.getChar(idx).character;
      return this.botCharacters.some((elem) => bot instanceof elem);
    }
    return false;
  }

  /**
   * @param {number} idx индекс персонажа
   * @returns Возвращает персонажа по индексу из gameState.allPositions
   */
  getChar(idx) {
    return this.gameState.allPositions.find((elem) => elem.position === idx);
  }

  /**
   * Расчитывает диапазон перемещения или атаки
   * @param {number} idx индекс персонажа
   * @param {number} char значение свойства персонажа
   * @returns возвращает массив валидных индексов
   */
  calcRange(idx, char) {
    const brdSize = this.gamePlay.boardSize;
    const range = [];
    const leftBorder = [];
    const rightBorder = [];

    for (let i = 0, j = brdSize - 1; leftBorder.length < brdSize; i += brdSize, j += brdSize) {
      leftBorder.push(i);
      rightBorder.push(j);
    }

    for (let i = 1; i <= char; i += 1) {
      range.push(idx + (brdSize * i));
      range.push(idx - (brdSize * i));
    }

    for (let i = 1; i <= char; i += 1) {
      if (leftBorder.includes(idx)) {
        break;
      }
      range.push(idx - i);
      range.push(idx - (brdSize * i + i));
      range.push(idx + (brdSize * i - i));
      if (leftBorder.includes(idx - i)) {
        break;
      }
    }

    for (let i = 1; i <= char; i += 1) {
      if (rightBorder.includes(idx)) {
        break;
      }
      range.push(idx + i);
      range.push(idx - (brdSize * i - i));
      range.push(idx + (brdSize * i + i));
      if (rightBorder.includes(idx + i)) {
        break;
      }
    }

    return range.filter((elem) => elem >= 0 && elem <= (brdSize ** 2 - 1));
  }

  onNewGameClick() {
    this.userTeam = new Team();
    this.botTeam = new Team();
    this.botCharacters = [Daemon, Undead, Vampire];
    this.userCharacters = [Bowman, Swordsman, Magician];
    this.gameState.selected = null;
    this.gameState.level = 1;
    this.gameState.points = 0;
    this.gameState.allPositions = [];
    this.gameState.isUsersTurn = true;

    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.userTeam.addAll(generateTeam([Bowman, Swordsman], 1, 2));
    this.botTeam.addAll(generateTeam(this.botCharacters, 1, 2));
    this.addsTheTeamToPosition(this.userTeam, this.getUserStartPositions());
    this.addsTheTeamToPosition(this.botTeam, this.getBotStartPositions());
    this.gamePlay.redrawPositions(this.gameState.allPositions);
    GamePlay.showMessage(`Уровень ${this.gameState.level}`);
  }

  onSaveGameClick() {
    this.stateService.save(GameState.from(this.gameState));
    GamePlay.showMessage('Игра сохранена');
  }

  onLoadGameClick() {
    GamePlay.showMessage('Игра загружается');
    const load = this.stateService.load();
    if (!load) {
      GamePlay.showError('Ошибка загрузки');
    }
    this.gameState.isUsersTurn = load.isUsersTurn;
    this.gameState.level = load.level;
    this.gameState.allPositions = [];
    this.gameState.points = load.points;
    this.gameState.statistics = load.statistics;
    this.gameState.selected = load.selected;
    this.userTeam = new Team();
    this.botTeam = new Team();
    load.allPositions.forEach((elem) => {
      let char;
      switch (elem.character.type) {
        case 'swordsman':
          char = new Swordsman(elem.character.level);
          this.userTeam.addAll([char]);
          break;
        case 'bowman':
          char = new Bowman(elem.character.level);
          this.userTeam.addAll([char]);
          break;
        case 'magician':
          char = new Magician(elem.character.level);
          this.userTeam.addAll([char]);
          break;
        case 'undead':
          char = new Undead(elem.character.level);
          this.botTeam.addAll([char]);
          break;
        case 'vampire':
          char = new Vampire(elem.character.level);
          this.botTeam.addAll([char]);
          break;
        case 'daemon':
          char = new Daemon(elem.character.level);
          this.botTeam.addAll([char]);
          break;
        // no default
      }
      char.health = elem.character.health;
      this.gameState.allPositions.push(new PositionedCharacter(char, elem.position));
    });
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.gameState.allPositions);
  }
}
