import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import GamePlay from './GamePlay';
import { generateTeam, playersInit } from './generators';
import cursors from './cursors';
import OwnTeam from './OwnTeam';
import EnemyTeam from './EnemyTeam';
import mergeTeams from './mergeTeams';
import GameState from './GameState';
import Indexes from './Indexes';
import themes from './themes';
import { calcBorderSide } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.countCharacterInTeam = 4;
    this.gameState = {};
  }

  init() {
    this.gameState = new GameState();
    this.setTheme();
    const ownTeam = generateTeam([Bowman, Swordsman, Magician], 2, this.countCharacterInTeam);
    const enemyTeam = generateTeam([Daemon, Undead, Vampire], 2, this.countCharacterInTeam);
    this.gameState.ownTeam = new OwnTeam(playersInit(
      ownTeam,
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
    ));
    this.gameState.enemyTeam = new EnemyTeam(playersInit(
      enemyTeam,
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
    ));
    this.gamePlay.redrawPositions(mergeTeams(
      this.gameState.ownTeam.getPositionedCharacters(),
      this.gameState.enemyTeam.getPositionedCharacters(),
    ));
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addCellDblClickListener((index) => this.onCellDblClick(index));
    this.gamePlay.addNewGameListener(() => this.startNewGame());
    this.gamePlay.addSaveGameListener(() => this.saveGame());
    this.gamePlay.addLoadGameListener(() => this.loadGame());
    this.gamePlay.addPopupClosedListener(() => this.onPopupClosed());
    this.showInfo();
    this.gameState.activePlayer = 0;
    this.play();
  }

  setTheme() {
    let { theme } = this.gameState;
    if (!theme) {
      [theme] = Object.values(themes);
    } else {
      let indexEstablishedTheme = Object.values(themes).findIndex(
        (el) => el === this.gameState.theme,
      );
      if (indexEstablishedTheme >= Object.values(themes).length - 1) {
        indexEstablishedTheme = -1;
      }
      theme = Object.values(themes)[indexEstablishedTheme + 1];
    }
    this.gameState.theme = theme;
    this.gamePlay.drawUi(theme);
  }

  play() {
    // если вражеская команда пуста
    if (!this.gameState.enemyTeam.getPositionedCharacters().length) {
      // если 4 раунд, то победа в игре
      if (this.gameState.round === 4) {
        GamePlay.showMessage('вы выиграли игру');
        this.gameState.setMaxScore();
        this.showInfo();
        this.blockGame();
        return;
      }
      // если не 4 раунд, то новый раунд
      this.gameState.addPoints(this.gameState.ownTeam.getScore());
      this.startNewRound();
    }
    // если команда игрока пуста
    if (!this.gameState.ownTeam.getPositionedCharacters().length) {
      GamePlay.showMessage('вы проиграли');
      this.blockGame();
      return;
    }
    // реакция бота
    if (this.gameState.activePlayer === 1) {
      this.reactEnemy();
      return;
    }
    // авто атака
    if (this.gameState.activePlayer === 0 && this.gameState.indexAutoAttack !== null) {
      this.checkAttack(this.gameState.indexAutoAttack);
    }
  }

  onCellClick(index) {
    if (index === undefined || index === null) {
      return;
    }
    if (this.gameState.selectIndex !== null) {
      this.gamePlay.deselectCell(this.gameState.selectIndex);
    }
    if (this.gameState.ownTeam.hasIndex(index)) {
      this.gamePlay.selectCell(index);
      this.gameState.selectIndex = index;
      return;
    }
    if (this.gameState.ownTeam.hasIndex(this.gameState.selectIndex)) {
      if (!this.gameState.ownTeam.hasIndex(index) && !this.gameState.enemyTeam.hasIndex(index)
        && this.getIndexesMoveAndAttack(
          this.gameState.selectIndex,
        ).arrayMoveIndexes.includes(index)) {
        this.move(index);
        return;
      }
      if (this.gameState.enemyTeam.hasIndex(index)
        && this.getIndexesMoveAndAttack(
          this.gameState.selectIndex,
        ).arrayAttackIndexes.includes(index)) {
        this.attack(index);
        return;
      }
    }
    GamePlay.showError('Не правильный выбор!');
  }

  onCellDblClick(index) {
    if (index === undefined || index === null) {
      return;
    }
    this.gameState.indexAutoAttack = index;
    this.gameState.indexAutoAttacker = this.gameState.selectIndex;
    this.play();
  }

  onCellEnter(index) {
    if (index === undefined || index === null || this.gameState.activePlayer === 1) {
      return;
    }
    // если клетка не пустая
    if (this.gameState.ownTeam.hasIndex(index) || this.gameState.enemyTeam.hasIndex(index)) {
      // вывод информации title
      const charEl = this.gamePlay.cells[index].querySelector('.character');
      const message = GameController.showInformation(charEl);
      this.gamePlay.showCellTooltip(message, index);
      // если свой
      if (this.gameState.ownTeam.hasIndex(index)) {
        this.showAttackAndMovementBoundaries(index);
        // если не selected
        if (this.gameState.selectIndex !== index) {
          this.gamePlay.setCursor(cursors.pointer);
        }
        // если чужой и персонаж выбран
      } else if (this.gameState.selectIndex !== null && this.gameState.enemyTeam.hasIndex(index)) {
        // если в зоне атаки выбранного персонажа
        if (this.getIndexesMoveAndAttack(
          this.gameState.selectIndex,
        ).arrayAttackIndexes.includes(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }
      // если клетка пустая
      // если персонаж selected
    } else if (this.gameState.selectIndex !== null) {
      // если в зоне похода выбранного персонажа
      if (this.getIndexesMoveAndAttack(
        this.gameState.selectIndex,
      ).arrayMoveIndexes.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  onCellLeave(index) {
    if (index === undefined || index === null) {
      return;
    }
    if (this.gameState.ownTeam.hasIndex(index) || this.gameState.enemyTeam.hasIndex(index)) {
      this.gamePlay.hideCellTooltip(index);
      if (this.gameState.ownTeam.hasIndex(index)) {
        this.hideAttackAndMovementBoundaries();
      }
    }
    this.gamePlay.setCursor(cursors.auto);
    if (!(this.gameState.selectIndex === index && this.gameState.ownTeam.hasIndex(index))) {
      this.gamePlay.deselectCell(index);
    }
  }

  onPopupClosed() {
    this.gamePlay.hidePopup();
  }

  static showInformation(charEl) {
    return `\u{1F396}${charEl.dataset.level} \u{2694}${charEl.dataset.attack} \u{1F6E1}${charEl.dataset.defence} \u{2764}${charEl.dataset.health}`;
  }

  move(index) {
    const charId = this.gamePlay.cells[this.gameState.selectIndex].querySelector('.character').dataset.id;
    const gameCtrlThis = this;
    /* eslint-disable-next-line */
    const generatorPositions = (function* (idx) {
      const indexes = new Indexes(this.gamePlay.boardSize);
      const { arrayIndexes } = new Indexes(this.gamePlay.boardSize);
      let [selectedCellI, selectedCellJ] = indexes.getIndexes(this.gameState.selectIndex);
      const [newPlaceI, newPlaceJ] = indexes.getIndexes(idx);
      const verticalIncrease = newPlaceI - selectedCellI;
      const horizontalIncrease = newPlaceJ - selectedCellJ;
      const countStep = Math.max(Math.abs(horizontalIncrease), Math.abs(verticalIncrease));
      for (let i = 0; i < countStep; i += 1) {
        const newCellI = Math.trunc(selectedCellI + verticalIncrease / countStep);
        const newCellJ = Math.trunc(selectedCellJ + horizontalIncrease / countStep);
        if (newCellI >= 0 && newCellI < this.gamePlay.boardSize
          && newCellJ >= 0 && newCellJ < this.gamePlay.boardSize) {
          selectedCellI = newCellI;
          selectedCellJ = newCellJ;
        }
        if (this.gameState.activePlayer === 0) {
          this.gameState.ownTeam.setNewPosition(
            charId,
            arrayIndexes[selectedCellI][selectedCellJ],
          );
          yield this.gameState.ownTeam.getPositionedCharacters();
        }
        if (this.gameState.activePlayer === 1) {
          this.gameState.enemyTeam.setNewPosition(
            charId,
            arrayIndexes[selectedCellI][selectedCellJ],
          );
          yield this.gameState.enemyTeam.getPositionedCharacters();
        }
      }
    }).call(gameCtrlThis, index);
    let newArrayPositionTeam;
    const drawСall = () => {
      setTimeout(() => {
        newArrayPositionTeam = generatorPositions.next();
        if (!newArrayPositionTeam.done) {
          if (this.gameState.activePlayer === 0) {
            this.gamePlay.redrawPositions(mergeTeams(
              newArrayPositionTeam.value,
              this.gameState.enemyTeam.getPositionedCharacters(),
            ));
          }
          if (this.gameState.activePlayer === 1) {
            this.gamePlay.redrawPositions(mergeTeams(
              this.gameState.ownTeam.getPositionedCharacters(),
              newArrayPositionTeam.value,
            ));
          }
          drawСall();
        } else {
          this.gameState.selectIndex = null;
          this.gamePlay.deselectCell(index);
          this.gameState.activePlayer = this.gameState.activePlayer === 0 ? 1 : 0;
          this.play();
        }
      }, 50);
    };
    drawСall();
  }

  attack(index) {
    const { attack } = this.gamePlay.cells[this.gameState.selectIndex].querySelector('.character').dataset;
    this.gamePlay.selectCell(this.gameState.selectIndex);
    this.gamePlay.selectCell(index, 'red');
    this.gamePlay.showDamage(index, attack).then(() => {
      if (this.gameState.activePlayer === 0) {
        this.gameState.enemyTeam.setDamage(this.gamePlay.cells[index].querySelector('.character').dataset.id, attack, (damage) => {
          this.gameState.addPoints(damage);
        });
        this.showInfo();
        this.gamePlay.redrawPositions(mergeTeams(
          this.gameState.ownTeam.getPositionedCharacters(),
          this.gameState.enemyTeam.getPositionedCharacters(),
        ));
      }
      if (this.gameState.activePlayer === 1) {
        this.gameState.enemysLastTarget = index;
        this.gameState.ownTeam.setDamage(this.gamePlay.cells[index].querySelector('.character').dataset.id, attack, (request) => {
          if (request) {
            this.gameState.enemysLastTarget = 'killed';
          }
        });
        this.gamePlay.redrawPositions(mergeTeams(
          this.gameState.ownTeam.getPositionedCharacters(),
          this.gameState.enemyTeam.getPositionedCharacters(),
        ));
      }
      this.gamePlay.deselectCell(this.gameState.selectIndex);
      this.gamePlay.deselectCell(index);
      this.gameState.selectIndex = null;
      this.gameState.activePlayer = this.gameState.activePlayer === 0 ? 1 : 0;
      this.play();
    });
  }

  reactEnemy() {
    const targetId = this.gameState.ownTeam.getTarget();
    const targetEl = this.gamePlay.boardEl.querySelector(`[data-id="${targetId}"]`);
    const targetIdx = this.gamePlay.cells.indexOf(targetEl.closest('.cell'));
    const attackerId = this.gameState.enemyTeam.getAtteckerId();
    const attackerEl = this.gamePlay.boardEl.querySelector(`[data-id="${attackerId}"]`);
    const attackerIdx = this.gamePlay.cells.indexOf(attackerEl.closest('.cell'));
    this.gameState.selectIndex = attackerIdx;
    if (this.getIndexesMoveAndAttack(attackerIdx).arrayAttackIndexes.includes(targetIdx)) {
      this.attack(targetIdx, attackerEl.attack);
    } else {
      this.chooseDirection(targetIdx);
    }
  }

  chooseDirection(targetIndex) {
    const indexes = new Indexes(this.gamePlay.boardSize);
    const { arrayIndexes } = new Indexes(this.gamePlay.boardSize);
    const [targetI, targetJ] = indexes.getIndexes(targetIndex);
    const [attackerI, attackerJ] = indexes.getIndexes(this.gameState.selectIndex);
    const attackRangeAttacer = this.gameState.getSelectPositionedCharacter()
      .character.charAttackRange;
    let verticalDirection = Math.sign(targetI - attackerI);
    let horizontalDirection = Math.sign(targetJ - attackerJ);
    const maxStepAttacker = this.gameState.getSelectPositionedCharacter().character.charHikeRange;
    /* eslint-disable-next-line */
    const directions = (function* (vertDirection, horDirection) {
      if (vertDirection && horDirection) {
        yield [0, horDirection];
        yield [vertDirection, 0];
        yield [-1 * vertDirection, horDirection];
        yield [vertDirection, -1 * horDirection];
      }
      if (vertDirection && !horDirection) {
        yield [vertDirection, -1];
        yield [vertDirection, 1];
        yield [0, -1];
        yield [0, 1];
      }
      if (!vertDirection && horDirection) {
        yield [-1, horDirection];
        yield [1, horDirection];
        yield [-1, 0];
        yield [1, 0];
      }
    }(verticalDirection, horizontalDirection));
    let stepAttacker;
    let newCellI = attackerI;
    let newCellJ = attackerJ;
    for (let i = 0; i < maxStepAttacker; i += 1) {
      newCellI += verticalDirection;
      newCellJ += horizontalDirection;
      if (newCellI >= 0 && newCellI < this.gamePlay.boardSize
        && newCellJ >= 0 && newCellJ < this.gamePlay.boardSize) {
        stepAttacker = i + 1;
        if (this.getIndexesMoveAndAttack(
          arrayIndexes[newCellI][newCellJ],
          attackRangeAttacer,
        ).arrayAttackIndexes.includes(targetIndex)) {
          break;
        }
      }
    }
    while (this.gameState.getPositionedCharacter(arrayIndexes[
      attackerI + verticalDirection * stepAttacker
    ][
      attackerJ + horizontalDirection * stepAttacker
    ])) {
      if (stepAttacker === 1) {
        const array = directions.next().value;
        const [newVerticalDirection, newHorizontalDirection] = array;
        const newPlaceI = attackerI + newVerticalDirection * stepAttacker;
        const newPlaceJ = attackerJ + newHorizontalDirection * stepAttacker;
        if (newPlaceI >= 0 && newPlaceI < this.gamePlay.boardSize
          && newPlaceJ >= 0 && newPlaceJ < this.gamePlay.boardSize) {
          [verticalDirection, horizontalDirection] = [newVerticalDirection, newHorizontalDirection];
        }
      }
      if (stepAttacker > 1) {
        stepAttacker -= 1;
      }
    }
    const newPlaceIndex = arrayIndexes[
      attackerI + verticalDirection * stepAttacker
    ][
      attackerJ + horizontalDirection * stepAttacker
    ];
    this.move(newPlaceIndex);
  }

  getIndexesMoveAndAttack(index, attackRange = null) {
    const indexes = new Indexes(this.gamePlay.boardSize);
    const arrIdxs = indexes.arrayIndexes;
    const [idxI, idxJ] = indexes.getIndexes(index);
    const arrMoveIdxs = [];
    if (!attackRange) {
      const countStep = this.gameState.getPositionedCharacter(index).character.charHikeRange;
      for (let i = 1; i <= countStep; i += 1) {
        arrMoveIdxs.push(arrIdxs[idxI][idxJ - i]);
        arrMoveIdxs.push(arrIdxs[idxI][idxJ + i]);
        if (idxI - i >= 0) {
          arrMoveIdxs.push(arrIdxs[idxI - i][idxJ]);
          arrMoveIdxs.push(arrIdxs[idxI - i][idxJ - i]);
          arrMoveIdxs.push(arrIdxs[idxI - i][idxJ + i]);
        }
        if (idxI + i < arrIdxs.length) {
          arrMoveIdxs.push(arrIdxs[idxI + i][idxJ]);
          arrMoveIdxs.push(arrIdxs[idxI + i][idxJ + i]);
          arrMoveIdxs.push(arrIdxs[idxI + i][idxJ - i]);
        }
      }
    }
    const attRange = attackRange
    || this.gameState.getPositionedCharacter(index).character.charAttackRange;
    const arrAttIdxs = [];
    const startI = idxI - attRange < 0 ? 0 : idxI - attRange;
    const startJ = idxJ - attRange < 0 ? 0 : idxJ - attRange;
    const endI = idxI + attRange >= arrIdxs.length ? arrIdxs.length - 1 : idxI + attRange;
    const endJ = idxJ + attRange >= arrIdxs.length ? arrIdxs.length - 1 : idxJ + attRange;
    for (let i = startI; i <= endI; i += 1) {
      for (let j = startJ; j <= endJ; j += 1) {
        arrAttIdxs.push(arrIdxs[i][j]);
      }
    }
    return {
      arrayMoveIndexes: arrMoveIdxs.filter((el) => el !== undefined),
      arrayAttackIndexes: arrAttIdxs,
    };
  }

  checkAttack(enenmyIndex) {
    this.gameState.selectIndex = this.gameState.indexAutoAttacker;
    const targetCell = this.gameState.getPositionedCharacter(enenmyIndex);
    const attackerCell = this.gameState.getSelectPositionedCharacter();
    if (targetCell === null || !this.gameState.enemyTeam.hasIndex(enenmyIndex)
      || attackerCell === null || this.gameState.enemysLastTarget === 'killed') {
      this.gameState.indexAutoAttack = null;
      this.gameState.indexAutoAttacker = null;
      this.gameState.enemysLastTarget = null;
      this.gameState.selectIndex = null;
      return;
    }
    this.attack(enenmyIndex);
  }

  startNewRound() {
    this.gameState.round += 1;
    this.setTheme();
    this.gameState.ownTeam = new OwnTeam(playersInit(
      this.gameState.ownTeam.teamLevelUp(),
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
    ));
    this.gameState.enemyTeam = new EnemyTeam(playersInit(
      EnemyTeam.teamLevelUp(this.gameState.round, this.countCharacterInTeam),
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
    ));
    this.gamePlay.redrawPositions(mergeTeams(
      this.gameState.ownTeam.getPositionedCharacters(),
      this.gameState.enemyTeam.getPositionedCharacters(),
    ));
    this.showInfo();
    this.gameState.activePlayer = 0;
  }

  blockGame() {
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.addCellDblClickListener(() => { });
    this.gameState.gameBlocking = true;
  }

  unBlockGame() {
    if (this.gamePlay.cellEnterListeners.length === 0) {
      this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    }
    if (this.gamePlay.cellLeaveListeners.length === 0) {
      this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    }
    if (this.gamePlay.cellClickListeners.length === 0) {
      this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    }
    this.gamePlay.addCellDblClickListener((index) => this.onCellDblClick(index));
    this.gameState.gameBlocking = false;
  }

  startNewGame() {
    this.gamePlay = new GamePlay();
    this.gamePlay.bindToDOM(document.querySelector('#game-container'));
    this.init();
  }

  saveGame() {
    if (this.gameState.gameBlocking) {
      GamePlay.showMessage('сейчас невозможно сохранить игру');
      return;
    }
    this.stateService.save(this.gameState.getData());
  }

  loadGame() {
    try {
      if (this.gameState.gameBlocking) {
        this.unBlockGame();
      }
      this.gameState.from(this.stateService.load());
      this.gamePlay.drawUi(this.gameState.theme);
      this.gamePlay.redrawPositions(mergeTeams(
        this.gameState.ownTeam.getPositionedCharacters(),
        this.gameState.enemyTeam.getPositionedCharacters(),
      ));
      this.showInfo();
    } catch (error) {
      GamePlay.showError(error.message);
    }
  }

  showInfo() {
    this.gamePlay.scoreEl.textContent = `Score: ${this.gameState.score}`;
    this.gamePlay.maxScoreEl.textContent = `MaxScore: ${GameState.maxScore}`;
    this.gamePlay.roundEl.textContent = `Round: ${this.gameState.round}`;
  }

  showAttackAndMovementBoundaries(index) {
    const moveRange = this.getIndexesMoveAndAttack(index).arrayMoveIndexes;
    const attackRange = this.getIndexesMoveAndAttack(index).arrayAttackIndexes;
    moveRange.forEach((el) => {
      this.gamePlay.cells[el].classList.add('move');
    });
    attackRange.forEach((el) => {
      const boardSide = calcBorderSide(el, attackRange, this.gamePlay.boardSize);
      if (boardSide) {
        this.gamePlay.cells[el].classList.add('border', `border-${boardSide}`);
      }
    });
  }

  hideAttackAndMovementBoundaries() {
    this.gamePlay.cells.forEach((element) => {
      element.classList.remove('move');
      element.classList.remove('border');
      const classBorder = [...element.classList].find((classEl) => classEl.startsWith('border-'));
      if (classBorder) {
        element.classList.remove(classBorder);
      }
    });
  }
}
