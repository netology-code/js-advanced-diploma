import Bowman from './characters/Bowman.js';
import Daemon from './characters/Daemon.js';
import Magician from './characters/Magician.js';
import Swordsman from './characters/Swordsman.js';
import Undead from './characters/Undead.js';
import Vampire from './characters/Vampire.js';
import GamePlay from './GamePlay.js';
import { generateTeam, playersInit } from './generators.js';
import cursors from './cursors.js';
import Cell from './Cell.js'
import OwnTeam from './OwnTeam.js';
import EnemyTeam from './EnemyTeam.js';
import mergeTeams from './mergeTeams.js';
import GameState from './GameState.js';
import Indexes from './Indexes.js';
import themes from './themes.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.selectedCellIdx = null;
    this.countCharacterInTeam = 4;
    this.ownTeam = {};
    this.enemyTeam = {};
  }

  init() {
    GameState.round = 1;
    this.setTheme();
    this.ownTeam = new OwnTeam(playersInit(
      generateTeam([Bowman, Swordsman, Magician], 2, this.countCharacterInTeam),
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
    ));
    this.enemyTeam = new EnemyTeam(playersInit(
      generateTeam([Daemon, Undead, Vampire], 2, this.countCharacterInTeam),
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
    ));
    this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), this.enemyTeam.getPositionedCharacters()));
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addNewGameListener(() => this.startNewGame());
    this.gamePlay.addSaveGameListener(() => this.saveGame());
    this.gamePlay.addLoadGameListener(() => this.loadGame())
    GameState.activePlayer = 0;
    this.play();
  }

  setTheme() {
    let theme = GameState.theme;
    if (!theme) {
      theme = Object.values(themes)[0];
    } else {
      let indexEstablishedTheme = Object.values(themes).findIndex(el => el === GameState.theme);
      if (indexEstablishedTheme >= Object.values(themes).length - 1) {
        indexEstablishedTheme = -1;
      }
      theme = Object.values(themes)[indexEstablishedTheme + 1];
    }
    GameState.theme = theme;
    this.gamePlay.drawUi(theme);
  }

  play() {
    GameState.ownTeam = this.ownTeam.getPositionedCharacters();
    GameState.enemyTeam = this.enemyTeam.getPositionedCharacters();
    if (!this.enemyTeam.getPositionedCharacters().length) {
      if (GameState.round === 4) {
        console.log('вы выиграли игру');
        this.blockGame();
      } else {
        console.log('вы выиграли раунд');
        this.startNewRound();
      }
    } else if (!this.ownTeam.getPositionedCharacters().length) {
      console.log('вы проиграли');
      this.blockGame();
    } else {
      if (GameState.activePlayer === 1) {
        this.reactEnemy();
      }
    }
  }

  onCellClick(index) {
    if (this.selectedCellIdx !== null) {
      this.gamePlay.deselectCell(this.selectedCellIdx);
    }
    const cell = new Cell(this.gamePlay.cells[index]);
    if (cell.role === 'ally') {
      this.gamePlay.selectCell(index);
      this.selectedCellIdx = index;
    } else if (cell.isEmpty && this.gamePlay.cells[index].classList.contains('selected-green')) {
      this.move(index);
    } else if (cell.role === 'enemy' && this.gamePlay.cells[index].classList.contains('selected-red')) {
      this.attack(index);
    } else {
      GamePlay.showError('Здесь нет твоего персонажа');
    }
  }

  onCellEnter(index) {
    const cell = new Cell(this.gamePlay.cells[index]);
    // если клетка не пустая
    if (!cell.isEmpty) {
      // вывод информации title
      const message = this.showInformation(cell.charEl);
      this.gamePlay.showCellTooltip(message, index);
      // если свой и не selected
      if (cell.role === 'ally' && !cell.isSelected) {
        this.gamePlay.setCursor(cursors.pointer);
        // если чужой и персонаж выбран
      } else if (this.selectedCellIdx !== null && cell.role === 'enemy') {
        // если в зоне атаки выбранного персонажа
        if (this.getIndexesMoveAndAttack(this.selectedCellIdx).arrayAttackIndexes.includes(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }
    } else {
      // если клетка пустая
      // если персонаж selected
      if (this.selectedCellIdx !== null) {
        // если в зоне похода выбранного персонажа
        if (this.getIndexesMoveAndAttack(this.selectedCellIdx).arrayMoveIndexes.includes(index)) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }
    }
  }

  onCellLeave(index) {
    if (this.gamePlay.cells[index].querySelector('.character')) {
      this.gamePlay.hideCellTooltip(index);
    };

    this.gamePlay.setCursor(cursors.auto);
    if (index !== this.selectedCellIdx) {
      this.gamePlay.deselectCell(index);
    }
  }

  showInformation(charEl) {
    return `\u{1F396}${charEl.dataset.level} \u{2694}${charEl.dataset.attack} \u{1F6E1}${charEl.dataset.defence} \u{2764}${charEl.dataset.health}`;
  }

  move(index) {
    const charId = this.gamePlay.cells[this.selectedCellIdx].querySelector('.character').dataset.id;
    const gameCtrlThis = this;
    const generatorPositions = (function* (index) {
      const indexes = new Indexes(this.gamePlay.boardSize);
      const arrayIndexes = new Indexes(this.gamePlay.boardSize).arrayIndexes;
      let [selectedCellI, selectedCellJ] = indexes.getIndexes(this.selectedCellIdx);
      const [newPlaceI, newPlaceJ] = indexes.getIndexes(index);
      const verticalIncrease = newPlaceI - selectedCellI;
      const horizontalIncrease = newPlaceJ - selectedCellJ;
      const countStep = Math.max(Math.abs(horizontalIncrease), Math.abs(verticalIncrease));
      for (let i = 0; i < countStep; i += 1) {
        const newCellI = Math.trunc(selectedCellI + verticalIncrease / countStep);
        const newCellJ = Math.trunc(selectedCellJ + horizontalIncrease / countStep);
        if (newCellI >= 0 && newCellI < this.gamePlay.boardSize && newCellJ >= 0 && newCellJ < this.gamePlay.boardSize) {
          selectedCellI = newCellI;
          selectedCellJ = newCellJ;
        }
        if (GameState.activePlayer === 0) {
          this.ownTeam.setNewPosition(charId, arrayIndexes[selectedCellI][selectedCellJ]);
          yield this.ownTeam.getPositionedCharacters();
        }
        if (GameState.activePlayer === 1) {
          this.enemyTeam.setNewPosition(charId, arrayIndexes[selectedCellI][selectedCellJ]);
          yield this.enemyTeam.getPositionedCharacters();
        }
      }
    }).call(gameCtrlThis, index);
    let newArrayPositionTeam;
    const drawСall = () => {
      setTimeout(() => {
        newArrayPositionTeam = generatorPositions.next();
        if (!newArrayPositionTeam.done) {
          if (GameState.activePlayer === 0) {
            this.gamePlay.redrawPositions(mergeTeams(newArrayPositionTeam.value, this.enemyTeam.getPositionedCharacters()));
          }
          if (GameState.activePlayer === 1) {
            this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), newArrayPositionTeam.value));
          }
          drawСall();
        } else {
          this.gamePlay.deselectCell(index);
          GameState.activePlayer = GameState.activePlayer === 0 ? 1 : 0;
          this.play();
        }
      }, 50);
    }
    drawСall();
  }

  attack(index) {
    const attack = this.gamePlay.cells[this.selectedCellIdx].querySelector('.character').dataset.attack;
    this.gamePlay.showDamage(index, attack).then(() => {
      if (GameState.activePlayer === 0) {
        this.enemyTeam.setDamage(this.gamePlay.cells[index].querySelector('.character').dataset.id, attack);
        this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), this.enemyTeam.getPositionedCharacters()));
      }
      if (GameState.activePlayer === 1) {
        this.ownTeam.setDamage(this.gamePlay.cells[index].querySelector('.character').dataset.id, attack);
        this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), this.enemyTeam.getPositionedCharacters()));
      }
      GameState.activePlayer = GameState.activePlayer === 0 ? 1 : 0;
      this.play();
    });
  }

  reactEnemy() {
    const targetId = this.ownTeam.getTarget();
    const targetEl = this.gamePlay.boardEl.querySelector(`[data-id=\"${targetId}\"]`);
    const targetIdx = this.gamePlay.cells.indexOf(targetEl.closest('.cell'));
    const attackerId = this.enemyTeam.getAtteckerId();
    const attackerEl = this.gamePlay.boardEl.querySelector(`[data-id=\"${attackerId}\"]`);
    const attackerIdx = this.gamePlay.cells.indexOf(attackerEl.closest('.cell'));
    this.selectedCellIdx = attackerIdx;
    if (this.getIndexesMoveAndAttack(attackerIdx).arrayAttackIndexes.includes(targetIdx)) {
      this.attack(targetIdx, attackerEl.attack);
    } else {
      this.chooseDirection(targetIdx);
    }
  }

  chooseDirection(targetIndex) {
    const indexes = new Indexes(this.gamePlay.boardSize);
    const arrayIndexes = new Indexes(this.gamePlay.boardSize).arrayIndexes;
    const [targetI, targetJ] = indexes.getIndexes(targetIndex);
    let [attackerI, attackerJ] = indexes.getIndexes(this.selectedCellIdx);
    const cell = new Cell(this.gamePlay.cells[this.selectedCellIdx]);
    const attackRangeAttacer = cell.charAttackRange;
    let verticalDirection = Math.sign(targetI - attackerI);
    let horizontalDirection = Math.sign(targetJ - attackerJ);
    let maxStepAttacker = new Cell(this.gamePlay.cells[this.selectedCellIdx]).charHikeRange;
    const directions = (function* (verticalDirection, horizontalDirection) {
      if (verticalDirection, horizontalDirection) {
        yield [0, horizontalDirection];
        yield [verticalDirection, 0];
        yield [-1 * verticalDirection, horizontalDirection];
        yield [verticalDirection, -1 * horizontalDirection];
      }
      if (verticalDirection, !horizontalDirection) {
        yield [verticalDirection, -1];
        yield [verticalDirection, 1];
        yield [0, -1];
        yield [0, 1];
      }
      if (!verticalDirection, horizontalDirection) {
        yield [-1, horizontalDirection];
        yield [1, horizontalDirection];
        yield [-1, 0];
        yield [1, 0];
      }
    })(verticalDirection, horizontalDirection);
    let stepAttacker;
    let newCellI = attackerI;
    let newCellJ = attackerJ;
    for (let i = 0; i < maxStepAttacker; i += 1) {
      newCellI += verticalDirection;
      newCellJ += horizontalDirection;
      if (newCellI >= 0 && newCellI < this.gamePlay.boardSize && newCellJ >= 0 && newCellJ < this.gamePlay.boardSize) {
        stepAttacker = i + 1;
        if (this.getIndexesMoveAndAttack(arrayIndexes[newCellI][newCellJ], attackRangeAttacer).arrayAttackIndexes.includes(targetIndex)) {
          break;
        }
      }
    }
    while (!new Cell(this.gamePlay.cells[arrayIndexes[attackerI + verticalDirection * stepAttacker][attackerJ + horizontalDirection * stepAttacker]]).isEmpty) {
      if (stepAttacker === 1) {
        [verticalDirection, horizontalDirection] = directions.next().value;
      }
      if (stepAttacker > 1) {
        stepAttacker = stepAttacker - 1;
      }
    }
    const newPlaceIndex = arrayIndexes[attackerI + verticalDirection * stepAttacker][attackerJ + horizontalDirection * stepAttacker];
    this.move(newPlaceIndex);
  }

  getIndexesMoveAndAttack(index, attackRange = NaN) {
    const indexes = new Indexes(this.gamePlay.boardSize);
    const arrayIndexes = indexes.arrayIndexes;
    const [indexI, indexJ] = indexes.getIndexes(index);
    const cell = new Cell(this.gamePlay.cells[index]);
    const countStep = cell.charHikeRange;
    const arrayMoveIndexes = [];
    for (let i = 1; i <= countStep; i += 1) {
      arrayMoveIndexes.push(arrayIndexes[indexI][indexJ - i]);
      arrayMoveIndexes.push(arrayIndexes[indexI][indexJ + i]);
      if (indexI - i >= 0) {
        arrayMoveIndexes.push(arrayIndexes[indexI - i][indexJ]);
        arrayMoveIndexes.push(arrayIndexes[indexI - i][indexJ - i]);
        arrayMoveIndexes.push(arrayIndexes[indexI - i][indexJ + i]);
      }
      if (indexI + i < arrayIndexes.length) {
        arrayMoveIndexes.push(arrayIndexes[indexI + i][indexJ]);
        arrayMoveIndexes.push(arrayIndexes[indexI + i][indexJ + i]);
        arrayMoveIndexes.push(arrayIndexes[indexI + i][indexJ - i]);
      }
    }
    attackRange = attackRange ? attackRange : cell.charAttackRange;
    const arrayAttackIndexes = [];
    const startI = indexI - attackRange < 0 ? 0 : indexI - attackRange;
    const startJ = indexJ - attackRange < 0 ? 0 : indexJ - attackRange;
    const endI = indexI + attackRange >= arrayIndexes.length ? arrayIndexes.length - 1 : indexI + attackRange;
    const endJ = indexJ + attackRange >= arrayIndexes.length ? arrayIndexes.length - 1 : indexJ + attackRange;
    for (let i = startI; i <= endI; i += 1) {
      for (let j = startJ; j <= endJ; j += 1) {
        arrayAttackIndexes.push(arrayIndexes[i][j]);
      }
    }
    return { arrayMoveIndexes: arrayMoveIndexes.filter(el => el !== undefined), arrayAttackIndexes: arrayAttackIndexes };
  }

  startNewRound() {
    GameState.round += 1;
    this.setTheme();
    this.ownTeam = new OwnTeam(playersInit(
      this.ownTeam.teamLevelUp(),
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
    ));
    this.enemyTeam = new EnemyTeam(playersInit(
      generateTeam([Daemon, Undead, Vampire], 2, this.countCharacterInTeam),
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
    ));
    GameState.ownTeam = this.ownTeam.getPositionedCharacters();
    GameState.enemyTeam = this.enemyTeam.getPositionedCharacters();
    this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), this.enemyTeam.getPositionedCharacters()));
    GameState.activePlayer = 0;
  }

  blockGame() {
    this.gamePlay.addCellEnterListener(() => {
      this.gamePlay.cellEnterListeners = [];
    });
    this.gamePlay.addCellLeaveListener(() => {
      this.gamePlay.cellLeaveListeners = [];
    });
    this.gamePlay.addCellClickListener(() => {
      this.gamePlay.cellClickListeners = [];
    });
  }

  startNewGame() {
    GameState.setMaxPoints(this.ownTeam.getPoints());
    this.gamePlay = new GamePlay();
    this.gamePlay.bindToDOM(document.querySelector('#game-container'));
    this.init();
  }

  saveGame() {
    this.stateService.save(GameState.getData());
  }

  loadGame() {
    GameState.from(this.stateService.load());
    this.ownTeam = new OwnTeam(GameState.ownTeam);
    this.enemyTeam = new EnemyTeam(GameState.enemyTeam);
    this.gamePlay.drawUi(GameState.theme);
    this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), this.enemyTeam.getPositionedCharacters()));
  }



}
