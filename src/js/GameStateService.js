export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state, name) {
    if (name) {
      this.storage.setItem(name, JSON.stringify(state));
    } else {
      this.storage.setItem('state', JSON.stringify(state));
    }
  }

  load(name) {
    try {
      if (name) {
        return JSON.parse(this.storage.getItem(name));
      }
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
