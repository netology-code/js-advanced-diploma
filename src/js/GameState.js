// import {
//   Bowman, Swordsman, Magician, Vampire, Undead, Daemon,
// } from './Characters/Characters';

export default class GameState {
  constructor() {
    this.currentLevel = 1;
    this.positionedCharacters = [];
    this.selected = {
      index: null,
      character: null,
    };

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
    // for (const prop in state) {
    //   this[prop] = state[prop];
    // }
    this.currentLevel = state.currentLevel;
    this.isMoveValid = state.isMoveValid;
    this.isAttackValid = state.isAttackValid;
    this.score = state.score;
  }
}
