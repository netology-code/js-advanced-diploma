import CharMath from "./CharMath";

export default class Magician extends CharMath {
  constructor(level, health) {
    super(level, 10, 40);
    this.type = "magician";
    this.attackRange = 4;
    this.moveRange = 1;

    if (health) {
      this.health = health;
    }
  }
  [Symbol.toStringTag] = "Magician";
}
