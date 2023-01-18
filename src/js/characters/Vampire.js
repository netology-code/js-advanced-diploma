import CharMath from './CharMath';

export default class Vampire extends CharMath {
  constructor(level, health) {
    super(level, 25, 25);
    this.type = 'vampire';
    this.attackRange = 2;
    this.moveRange = 2;

    if (health) {
      this.health = health;
    }
  }

  [Symbol.toStringTag] = 'Vampire';
}
