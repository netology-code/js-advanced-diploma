export default class GameState {
  static activePlayer;
  static round;
  static maxPoints = 0;
  static ownTeam = [];
  static enemyTeam = [];
  static theme = null;
  static from(object) {
    this.activePlayer = object.activePlayer;
    this.round = object.round;
    this.maxPoint = object.maxPoint;
    this.ownTeam = object.ownTeam;
    this.enemyTeam = object.enemyTeam;
    this.theme = object.theme;
    return null;
  }
  static getData() {
    return {
      activePlayer: this.activePlayer,
      round: this.round,
      maxPoints: this.maxPoints,
      ownTeam: this.ownTeam,
      enemyTeam: this.enemyTeam,
      theme: this.theme,
    }
  }
  static setMaxPoints(points) {
    if (points > this.maxPoints) {
      this.maxPoints = points;
    }
  }
}
