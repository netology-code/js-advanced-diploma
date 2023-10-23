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
    this.attack = Math.round(Math.max(this.attack, this.attack * (60 + this.health) / 100));
    this.defence = Math.round(Math.max(this.defence, this.defence * (60 + this.health) / 100));
    this.health = Math.round(Math.min(this.health + 80, 100));
    this.level = this.level + 1;
  }
}
