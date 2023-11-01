export default class GameState {
  static activePlayer;

  static round;

  static maxScore = 0;

  static ownTeam = [];

  static enemyTeam = [];

  static score = 0;

  static theme = null;

  static indexAutoAttack = null;

  static indexAutoAttacker = null;

  static enemysLastTarget = null;

  static from(object) {
    this.activePlayer = object.activePlayer;
    this.round = object.round;
    this.maxScore = object.maxScore;
    this.ownTeam = object.ownTeam;
    this.enemyTeam = object.enemyTeam;
    this.theme = object.theme;
    this.score = object.score;
    return null;
  }

  static getData() {
    return {
      activePlayer: this.activePlayer,
      round: this.round,
      score: this.score,
      maxScore: this.maxScore,
      ownTeam: this.ownTeam,
      enemyTeam: this.enemyTeam,
      theme: this.theme,
    };
  }

  static setMaxScore() {
    if (this.score > this.maxScore) {
      this.maxScore = this.score;
    }
  }

  static addPoints(points) {
    this.score += points;
  }
}
