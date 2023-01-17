import CharMath from "./CharMath";

export default class Undead extends CharMath {
  constructor(level, attack = 40, defence = 10) {
    super(level, attack, defence);
    this.type = "undead";
    this.attackRange = 1;
    this.moveRange = 4;
  }
}
