export default class Team {
  constructor() {
    this.members = new Set();
  }

  add(character) {
    if (this.members.has(character)) {
      throw new Error('Ошибка!Такой персонаж уже eсть в команде!');
    }
    this.members.add(character);
  }

  addAll(characters) {
    this.members = new Set([...this.members, ...characters]);
  }

  delete(elem) {
    this.members.delete(elem);
  }

  toArray() {
    return [...this.members];
  }

  [Symbol.iterator]() {
    return this.members[Symbol.iterator]();
  }
}
