export default class GameState {
  constructor() {
    this.isActivePlayerUser = true;
    // this.isCharacterSelected = false;
    this.selected = {
      index: null,
      character: null,
    };
    this.isMoveValid = false;
    this.isAttackValid = false;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
