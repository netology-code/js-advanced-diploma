import Character from "../Character";

export default class Daemon extends Character {
  constructor(level) {
    super(level);
    this.type = "daemon";
    this.attack = 10;
    this.defence = 10;
    this.attackRange = 4;
    this.moveRange = 1;

    if (level > 1) {
      this.levelUp(level);
    }
  }
}
