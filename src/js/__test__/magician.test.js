import Magician from '../Characters/Magician';
import Character from '../Character';

describe('Magician', () => {
  test('should create instance of class Magician', () => {
    const result = new Magician(1);

    expect(result).toBeInstanceOf(Magician);
  });

  test('should create instance of class Character', () => {
    const result = new Magician(1);

    expect(result).toBeInstanceOf(Character);
  });

  test('should create instance of class Magician with initial value', () => {
    const result = new Magician(1);

    expect(result).toEqual({
      type: 'magician',
      health: 50,
      level: 1,
      attack: 10,
      defence: 40,
    });
  });
});
