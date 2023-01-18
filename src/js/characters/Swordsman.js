import CharMath from './CharMath';

export default class Swordsman extends CharMath {
  constructor(level, health) {
    super(level, 40, 10);
    this.type = 'swordsman';
    this.attackRange = 1;
    this.moveRange = 4;

    if (health) {
      this.health = health;
    }
  }

  [Symbol.toStringTag] = 'Swordsman';
}
