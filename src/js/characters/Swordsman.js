import CharMath from "./CharMath";

export default class Swordsman extends CharMath {
  constructor(level, attack = 40, defence = 10) {
    super(level, attack, defence);
    this.type = "swordsman";
    this.attackRange = 1;
    this.moveRange = 4;
  }
}
