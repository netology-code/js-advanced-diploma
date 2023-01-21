export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state, name = 'state') {
      this.storage.setItem(name, JSON.stringify(state));
  }

  load(name = 'state') {
    try {
        return JSON.parse(this.storage.getItem(name));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
