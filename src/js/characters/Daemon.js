import CharMath from "./CharMath";

export default class Daemon extends CharMath {
  constructor(level, attack = 10, defence = 10) {
    super(level, attack, defence);
    this.type = "daemon";
    this.attackRange = 4;
    this.moveRange = 1;
  }
}
