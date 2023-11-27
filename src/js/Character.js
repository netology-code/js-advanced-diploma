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
  constructor(level, type = 'generic') {
    if (this.constructor.name === 'Character') {
      throw new Error('Конструктор new Character() запрещен для вызова!');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }

  levelUp() {
    let coeff = 40;
    if (this.level === 1) {
      coeff = 80;
    }
    this.attack = Math.round(Math.max(
      this.attack * 1.2,
      this.attack * ((coeff + this.health) / 100),
    ));
    this.defence = Math.round(Math.max(
      this.defence * 1.2,
      this.defence * ((coeff + this.health) / 100),
    ));
    this.health = Math.round(Math.min(this.health + 80, 100));
    this.level += 1;
  }
}
