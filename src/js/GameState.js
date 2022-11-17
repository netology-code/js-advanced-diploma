export default class GameState {
  static from(object) {
    if (typeof object === 'object') {
      return object;
    }
    // TODO: create object
    return null;
  }
}
