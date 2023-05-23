export default class GameState {
  constructor() {
    this.isUsersTurn = true;
    this.level = 1;
    this.allPositions = [];
    this.points = 0;
    this.statistics = [];
    this.selected = null;
  }

  static from(object) {
    // TODO: create object
    if (typeof object === 'object') {
      return object;
    }
    return null;
  }
}
