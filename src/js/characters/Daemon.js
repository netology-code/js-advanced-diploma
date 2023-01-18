import CharMath from './CharMath';

export default class Daemon extends CharMath {
  constructor(level, health) {
    super(level, 10, 10);
    this.type = 'daemon';
    this.attackRange = 4;
    this.moveRange = 1;

    if (health) {
      this.health = health;
    }
  }

  [Symbol.toStringTag] = 'Daemon';
}
