/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = "generic") {
    this.level = 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.attackRange = 0;
    this.moveRange = 0;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === "Character") {
      throw new Error("new Character() is forbidden");
    }
  }

  levelUp() {
    this.level += 1;
    this.attack = +Math.max(
      this.attack,
      (this.attack * (80 + this.health)) / 100
    ).toFixed(0);
    this.defence = +Math.max(
      this.defence,
      (this.defence * (80 + this.health)) / 100
    ).toFixed(0);
    this.health = +Math.min(this.health + 80, 100).toFixed(0);
  }
}
