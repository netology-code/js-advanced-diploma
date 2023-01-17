import CharMath from "./CharMath";

export default class Magician extends CharMath {
  constructor(level, attack = 10, defence = 40) {
    super(level, attack, defence);
    this.type = "magician";
    this.attackRange = 4;
    this.moveRange = 1;
  }
}
