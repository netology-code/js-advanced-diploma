import Character from '../Character';

describe('Character', () => {
  test('shoul throw when class Character is created', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const character = new Character();
    }).toThrow();
  });
});
