import Bowman from '../Characters/Bowman';
import Character from '../Character';

describe('Bowman', () => {
  test('should create instance of class Bowman', () => {
    const result = new Bowman(3);

    expect(result).toBeInstanceOf(Bowman);
  });

  test('should create instance of class Character', () => {
    const result = new Bowman(3);

    expect(result).toBeInstanceOf(Character);
  });

  test('should create instance of class Bowman with initial value', () => {
    const result = new Bowman(1);

    expect(result).toEqual({
      type: 'bowman',
      health: 50,
      level: 1,
      attack: 25,
      defence: 25,
      attackRange: 2,
      moveRange: 2,
    });
  });

  test('should return false, when character`s health > 0', () => {
    const char = new Bowman(1);

    expect(char.isDead()).toBeFalsy();
  });

  test('should return true, when character`s health <= 0', () => {
    const char = new Bowman(1);
    char.health = 0;

    expect(char.isDead()).toBeTruthy();
  });

  test.each([
    [2, 33, 33, 100, 1, 25, 25, 50],
    [3, 50, 50, 100, 1, 30, 30, 5],
    [3, 25, 25, 90, 2, 25, 25, 10],
  ])(
    'should levelup character to %i level, set attack to %i, set defence to %i and up health to %i',
    (newLevel, newAttack, newDefence, newHealth, oldLevel, oldAttack, oldDefence, oldHealth) => {
      const char = new Bowman(oldLevel);
      char.attack = oldAttack;
      char.defence = oldDefence;
      char.health = oldHealth;

      for (let i = oldLevel; i < newLevel; i++) {
        char.levelUp();
      }

      expect(char).toEqual({
        type: 'bowman',
        health: newHealth,
        level: newLevel,
        attack: newAttack,
        defence: newDefence,
        attackRange: 2,
        moveRange: 2,
      });
    },
  );
});
