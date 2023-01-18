import Character from '../Character';

test('error for new Character', () => {
  const expecting = new Error('new Character() is forbidden');
  function newCharacter() {
    const result = new Character();
    return result;
  }
  expect(newCharacter).toThrow(expecting);
});
