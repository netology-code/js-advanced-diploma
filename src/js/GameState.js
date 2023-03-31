export default class GameState {
  constructor() {
    this.currentLevel = 1;
    this.positionedCharacters = [];
    this.selected = {
      index: null,
      character: null,
    };
    this.isMoveValid = false;
    this.isAttackValid = false;
    this.score = 0;
  }

  static from(object) {
    // TODO: create object
    const state = {};

    for (const prop in object) {
      if (Object.hasOwn(object, prop)) {
        state[prop] = object[prop];
      }
    }
    return state;
  }

  setState(state) {
    // eslint-disable-next-line guard-for-in
    for (const prop in state) {
      this[prop] = state[prop];
    }
  }
}
