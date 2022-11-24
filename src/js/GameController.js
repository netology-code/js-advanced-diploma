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
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.userTeam.addAll(generateTeam([Bowman, Swordsman], 1, 2));
    this.botTeam.addAll(generateTeam(this.botCharacters, 1, 2));
    this.addsTheTeamToPosition(this.userTeam, this.getUserStartPositions());
    this.addsTheTeamToPosition(this.botTeam, this.getBotStartPositions());
    this.gamePlay.redrawPositions(this.gameState.allPositions);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
   
   //GamePlay.showMessage(`Уровень ${this.gameState.level}`);
  }


  onCellClick(index) {
    // TODO: react to click

    if (this.gameState.level === 5 || this.userTeam.members.size === 0) {
      return;
    }
    if (this.gameState.selected !== null && this.getChar(index) && this.isBotChar(index)) {
      if (this.isAttack(index)) {
        this.getAttack(index, this.gameState.selected);
      }
    }
    if (this.gameState.selected !== null && this.isMoving(index) && !this.getChar(index)) {
      if (this.gameState.isUsersTurn) {
        this.getUsersTurn(index);
      }
    }
    if (this.gameState.selected !== null && !this.isMoving(index) && !this.isAttack(index)) {
      if (this.gameState.isUsersTurn && !this.getChar(index)) {
        GamePlay.showError('Недопустимый ход!');
      }
    }
    if (this.getChar(index) && this.isBotChar(index) && !this.isAttack(index)) {
      GamePlay.showError('Это не ваш персонаж!');
    }
    if (this.getChar(index) && this.isUserChar(index)) {
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-yellow'));
      this.gamePlay.selectCell(index);
      this.gameState.selected = index;
    }
  }

   

  onCellEnter(index) {
    // TODO: react to mouse enter

    if (this.getChar(index) && this.isUserChar(index)) {
      this.gamePlay.setCursor(cursors.pointer);
    }
    if (this.gameState.selected !== null && !this.getChar(index) && this.isMoving(index)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }
    if (this.getChar(index)) {
      const char = this.getChar(index).character;
      const message = `\u{1F396}${char.level}\u{2694}${char.attack}\u{1F6E1}${char.defence}\u{2764}${char.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
    if (this.gameState.selected !== null && this.getChar(index) && !this.isUserChar(index)) {
      if (this.isAttack(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
    }
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
        
      });
      this.gameState.isUsersTurn = false;
    }
  }

 getUsersTurn(idx) {
  this.getSelectedChar().position = idx;
  this.gamePlay.deselectCell(this.gameState.selected);
  this.gamePlay.redrawPositions(this.gameState.allPositions);
  this.gameState.selected = idx;
 // this.gameState.isUsersTurn = false; //ход юзера false 
 //this.getBotsResponse();//далее ход компика вывести функцию хода компика
}

  
  //  Проверяет валидность диапазона перемещения
  
   isMoving(idx) {
    if (this.getSelectedChar()) {
      const moving = this.getSelectedChar().character.distance;
      const arr = this.calcRange(this.gameState.selected, moving);
      return arr.includes(idx);
    }
    return false;
  }

  
  // валидность диапазона атаки
   
  isAttack(idx) {
    if (this.getSelectedChar()) {
      const stroke = this.getSelectedChar().character.attackRange;
      const arr = this.calcRange(this.gameState.selected, stroke);
      return arr.includes(idx);
    }
    return false;
  }
  
  getSelectedChar() {
    return this.gameState.allPositions.find((elem) => elem.position === this.gameState.selected);
  }

  
    // Возвращает массив возможных позиций игрока при старте игры
   
  getUserStartPositions() {
    const size = this.gamePlay.boardSize;
    this.userPosition = [];
    for (let i = 0, j = 1; this.userPosition.length < size * 2; i += size, j += size) {
      this.userPosition.push(i, j);
    }
    return this.userPosition;
  }

  
//  массив возможных позиций бота при старте игры
   
  getBotStartPositions() {
    const size = this.gamePlay.boardSize;
    const botPosition = [];
    for (let i = size - 2, j = size - 1; botPosition.length < size * 2; i += size, j += size) {
      botPosition.push(i, j);
    }
    return botPosition;
  }

  
  getRandom(positions) {
    this.positions = positions;
    return this.positions[Math.floor(Math.random() * this.positions.length)];
  }

  
  //  Добавляет команду в gameState.allPositions
   
  
  addsTheTeamToPosition(team, positions) {
    const copyPositions = [...positions];
    for (const item of team) {
      const random = this.getRandom(copyPositions);
      this.gameState.allPositions.push(new PositionedCharacter(item, random));
      copyPositions.splice(copyPositions.indexOf(random), 1);
    }
  }

 
  
   isUserChar(idx) {
    if (this.getChar(idx)) {
      const char = this.getChar(idx).character;
      return this.userCharacters.some((elem) => char instanceof elem);
    }
    return false;
  }

  isBotChar(idx) {
    if (this.getChar(idx)) {
      const bot = this.getChar(idx).character;
      return this.botCharacters.some((elem) => bot instanceof elem);
    }
    return false;
  }


  //  Возвращает персонажа по индексу из gameState.allPositions
 
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
  }}
  