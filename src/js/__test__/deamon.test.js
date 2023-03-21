import Daemon from '../Characters/Daemon';
import Character from '../Character';

describe('Daemon', () => {
  test('should create instance of class Daemon', () => {
    const result = new Daemon(1);

    expect(result).toBeInstanceOf(Daemon);
  });

  test('should create instance of class Character', () => {
    const result = new Daemon(1);

    expect(result).toBeInstanceOf(Character);
  });

  test('should create instance of class Daemon with initial value', () => {
    const result = new Daemon(1);

    expect(result).toEqual({
      type: 'daemon',
      health: 50,
      level: 1,
      attack: 10,
      defence: 10,
    });
  });
});
