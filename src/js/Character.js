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
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.attackRange = 0;
    this.moveRange = 0;
    // this.isSelected = false; // Уточнить необходимость

    if (new.target.name === 'Character') {
      throw new Error('use "new Character()" denied');
    }
  }

  isDead() {
    return this.health <= 0;
  }

  levelUp() {
    this.level += 1;
    this.attack += Math.max(this.attack, this.attack * ((80 + this.health) / 100));
    this.defence += Math.max(this.defence, this.defence * ((80 + this.health) / 100));
    this.health = this.health > 20 ? 100 : this.health + 80;
  }
}
