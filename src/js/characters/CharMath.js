import Character from "../Character";

export default class CharMath extends Character {
  constructor(level, attack, defence) {
    super(level);
    this.attack = attack;
    this.defence = defence;
    if (level > 1) {
      for (let i = 1; i < level; i += 1) {
        super.levelUp();
      }
    }
  }
}
