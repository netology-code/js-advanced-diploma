import themes from "./themes";
import cursors from "./cursors";
import { generateTeam } from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";
import GameState from "./GameState";
import Team from "./Team";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.genTheme = themes.get(themes.themes.prairie);
  }

  init() {
    // this.stateService.storage.clear();
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(() => {
      this.saveToStorage(this.gameState, "save");
    });
    this.gamePlay.addLoadGameListener(() => {
      this.loadFromStorage("save");
    });

    // TODO: load saved stated from stateService
    if (this.stateService.storage.length !== 0) {
      this.loadFromStorage();
    } else {
      this.newGame();
    }
  }

  newGame() {
    const maxPoints =
      this.gameState.maxPoints > this.gameState.points
        ? this.gameState.maxPoints
        : this.gameState.points;
    this.gameState = new GameState(maxPoints);
    this.resetListeners();

    this.gameState.theme = themes.themes.prairie;
    this.gamePlay.drawUi(this.gameState.theme);

    const playerTeam = generateTeam(this.gameState.playerTypes, 3, 4);
    this.positionTeam(playerTeam, [1, 2]);

    const enemyTeam = generateTeam(this.gameState.enemyTypes, 3, 4);
    this.positionTeam(enemyTeam, [7, 8]);

    this.gamePlay.redrawPositions(this.gameState.charactersPositions);
  }

  nextLevel(playerTeam) {
    this.gameState.theme = this.genTheme.next().value;
    this.gamePlay.drawUi(this.gameState.theme);
    playerTeam.characters.forEach((character) => character.levelUp());
    this.gameState.charactersPositions = [];

    this.positionTeam(playerTeam, [1, 2]);
    let EnemyLevel = playerTeam.characters.reduce(
      (max, character) => (max = Math.max(max, character.level)),
      0
    );

    const enemyTeam = generateTeam(this.gameState.enemyTypes, ++EnemyLevel, 4);
    this.positionTeam(enemyTeam, [7, 8]);

    this.gamePlay.redrawPositions(this.gameState.charactersPositions);
  }

  onCellClick(index) {
    // TODO: react to click
    const character = this.hasCharacter(index);
    if (character && this.isPlayer(character.character)) {
      if (this.gameState.focusedCell) {
        this.gamePlay.deselectCell(this.gameState.focusedCell);
      }

      this.gameState.focusedCell = index;
      this.gamePlay.selectCell(index);
      this.gameState.focusedCharacter = this.focusCharacter(character);
    } else if (character && !this.isPlayer(character.character)) {
      if (
        this.gameState.focusedCharacter &&
        this.gameState.focusedCharacter.posibleAttacks.includes(index)
      ) {
        this.attack(character).then(() => {
          this.aiMove();
        });
      } else {
        GamePlay.showError("Выберите персонажа Игрока");
      }
    } else if (!character && this.gameState.focusedCharacter) {
      if (
        !this.isPlayer(character.character) &&
        this.gameState.focusedCharacter.posibleMoves.includes(index)
      ) {
        this.moveCharacter(this.gameState.focusedCharacter, index);
        this.aiMove();
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const character = this.hasCharacter(index);
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

    if (this.gameState.focusedCharacter && !character) {
      if (this.gameState.focusedCharacter.posibleMoves.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, "green");
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (
      this.gameState.focusedCharacter &&
      !this.isPlayer(character.character)
    ) {
      if (this.gameState.focusedCharacter.posibleAttacks.includes(index)) {
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
      this.gameState.focusedCharacter &&
      this.gameState.focusedCharacter.position === index
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

  resetSelect(cell) {
    this.gamePlay.deselectCell(cell);
    this.gameState.focusedCell = undefined;
    this.gameState.focusedCharacter = undefined;
  }

  remove(character) {
    const index = this.gameState.charactersPositions.findIndex(
      (el) => el.character === character
    );
    this.gameState.charactersPositions.splice(index, 1);
  }

  getRandomPosition(allowedCells) {
    let position;
    do {
      position = allowedCells[Math.round(Math.random() * allowedCells.length)];
    } while (this.hasCharacter(position) || position === undefined);
    return position;
  }

  hasCharacter(position) {
    const character = this.gameState.charactersPositions.find(
      (char) => char.position === position
    );
    return character ? character : false;
  }

  getEnemyCharacter() {
    const enemyTeam = this.gameState.charactersPositions.filter((el) =>
      this.gameState.enemyTypes.some((type) => el.character instanceof type)
    );
    const aiCharacter = this.randomTarget(enemyTeam);
    return aiCharacter;
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

  moveEnd() {
    this.gameState.charactersPositions
      .filter((el) => el.character.health <= 0)
      .forEach((el) => this.remove(el.character));

    const playerTeam = this.gameState.charactersPositions.filter((el) =>
      this.isPlayer(el.character)
    );
    const enemyTeam = this.gameState.charactersPositions.filter((el) =>
      this.gameState.enemyTypes.some((type) => el.character instanceof type)
    );
    this.saveToStorage(this.gameState);
    this.gameState.focusedCharacter = undefined;
    this.gamePlay.redrawPositions(this.gameState.charactersPositions);

    if (playerTeam.length === 0) {
      this.gameState.maxPoints =
        this.gameState.points > this.gameState.maxPoints
          ? this.gameState.points
          : this.gameState.maxPoints;
      console.log(this.gameState);
      this.gamePlay.setCursor(cursors.auto);
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    } else if (enemyTeam.length === 0) {
      const unposPlayerTeam = playerTeam.map(
        (character) => character.character
      );
      this.nextLevel(new Team(unposPlayerTeam));
    }
  }

  resetListeners() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  saveToStorage(obj, name) {
    if (!("toJSON" in obj)) {
      throw new Error("Передан некорректный GameState");
    }
    this.stateService.save(obj.toJSON(), name);
  }

  loadFromStorage(name) {
    const gameStateFromJSON = this.stateService.load(name);
    this.gameState = GameState.from(gameStateFromJSON);
    this.gamePlay.drawUi(this.gameState.theme);
    this.gameState.focusedCharacter = undefined;
    this.gamePlay.redrawPositions(this.gameState.charactersPositions);
  }

  moveCharacter(character, index) {
    this.hasCharacter(character.position).position = index;
    this.gamePlay.redrawPositions(this.gameState.charactersPositions);

    this.resetSelect(character.position);
    this.moveEnd();
  }

  aiMove() {
    const aiCharacter = this.getEnemyCharacter();
    this.gameState.focusedCharacter = this.focusCharacter(aiCharacter);

    if (this.gameState.focusedCharacter.posibleAttacks.length > 0) {
      const target = this.randomTarget(
        this.gameState.focusedCharacter.posibleAttacks
      );
      this.attack(this.hasCharacter(target));
      this.saveToStorage(this.gameState);
    } else {
      const target = this.randomTarget(
        this.gameState.focusedCharacter.posibleMoves
      );
      this.moveCharacter(this.gameState.focusedCharacter, target);
    }
  }

  async attack(target) {
    const attacker = this.gameState.focusedCharacter.character;
    const damage = +Math.max(
      attacker.attack - target.character.defence,
      attacker.attack * 0.1
    ).toFixed(0);

    if (this.isPlayer(attacker)) {
      this.gameState.points += damage;
    }

    target.character.health -= damage;
    await this.gamePlay.showDamage(target.position, damage);
    this.resetSelect(this.gameState.focusedCharacter.position);
    this.gamePlay.redrawPositions(this.gameState.charactersPositions);
    this.moveEnd();
  }

  focusCharacter(pCharacter) {
    let { character, position } = pCharacter;
    const y = Math.floor(position / this.gamePlay.boardSize);
    const x = position % this.gamePlay.boardSize;

    const posibleAttacks = [];
    const posibleMoves = [];

    const start = (i, attibute) => {
      return i - attibute >= 0 ? i - attibute : 0;
    };
    const end = (i, attibute) => {
      return i + attibute < this.gamePlay.boardSize
        ? i + attibute
        : this.gamePlay.boardSize - 1;
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
        if (this.hasCharacter(cell) && cell !== position) {
          if (!this.isSameTeam(character, this.hasCharacter(cell).character)) {
            posibleAttacks.push(cell);
          }
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
        if (cell !== position && !this.hasCharacter(cell)) {
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

  randomTarget(arr) {
    if (arr.length === 0) {
      return false;
    }
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
