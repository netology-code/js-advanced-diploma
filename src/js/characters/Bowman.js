import CharMath from "./CharMath";

export default class Bowman extends CharMath {
  constructor(level, attack = 25, defence = 25) {
    super(level, attack, defence);
    this.type = "bowman";
    this.attackRange = 2;
    this.moveRange = 2;
  }
}
