import OwnTeam from './OwnTeam';
import EnemyTeam from './EnemyTeam';

export default class GameState {
  constructor() {
    this.ownTeam = {};
    this.enemyTeam = {};
    this.selectIndex = null;
    this.activePlayer = 0;
    this.round = 1;
    this.score = 0;
    this.theme = null;
    this.indexAutoAttack = null;
    this.indexAutoAttacker = null;
    this.enemysLastTarget = null;
    this.gameBlocking = false;
  }

  static maxScore = 0;

  getPositionedCharacter(index) {
    if (this.ownTeam.hasIndex(index)) {
      return Object.values(this.ownTeam).find((value) => index === value.position);
    }
    if (this.enemyTeam.hasIndex(index)) {
      return Object.values(this.enemyTeam).find((value) => index === value.position);
    }
    return null;
  }

  getSelectPositionedCharacter() {
    return this.getPositionedCharacter(this.selectIndex);
  }

  from(object) {
    /* eslint-disable-next-line */
    this.ownTeam = new OwnTeam(object.ownPositionedCharacters),
    /* eslint-disable-next-line */
    this.enemyTeam = new EnemyTeam(object.enemyPositionedCharacters),
    this.selectIndex = object.selectIndex;
    this.activePlayer = object.activePlayer;
    this.round = object.round;
    this.score = object.score;
    this.theme = object.theme;
    GameState.maxScore = object.maxScore;
    this.indexAutoAttack = object.indexAutoAttack;
    this.indexAutoAttacker = object.indexAutoAttacker;
    this.enemysLastTarget = object.enemysLastTarget;
    this.gameBlocking = object.gameBlocking;
  }

  getData() {
    return {
      ownPositionedCharacters: this.ownTeam.getPositionedCharacters(),
      enemyPositionedCharacters: this.enemyTeam.getPositionedCharacters(),
      selectIndex: this.selectIndex,
      activePlayer: this.activePlayer,
      round: this.round,
      score: this.score,
      theme: this.theme,
      maxScore: GameState.maxScore,
      indexAutoAttack: this.indexAutoAttack,
      indexAutoAttacker: this.indexAutoAttacker,
      enemysLastTarget: this.enemysLastTarget,
      gameBlocking: this.gameBlocking,
    };
  }

  setMaxScore() {
    if (this.score > GameState.maxScore) {
      GameState.maxScore = this.score;
    }
  }

  addPoints(points) {
    this.score += Math.floor(points);
  }
}
