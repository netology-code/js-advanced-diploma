export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }

  saveHiScore(hiScore) {
    this.storage.setItem('hiscore', hiScore.toString());
  }

  loadHiScore() {
    try {
      return +this.storage.getItem('hiscore');
    } catch (e) {
      throw new Error('Invalid hiscore');
    }
  }
}
