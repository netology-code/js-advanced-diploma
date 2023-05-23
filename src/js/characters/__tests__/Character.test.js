import Character from '../Character';

import Bowman from '../Characters/Bowman';
import Daemon from '../Characters/Daemon';
import Magician from '../Characters/Magician';
import Swordsman from '../Characters/Swordsman';
import Undead from '../Characters/Undead';
// eslint-disable-next-line import/no-unresolved
import Vampire from '../Characters/Vampire';

test('Создание объекта класса Character', () => {
  expect(() => new Character(1)).toThrow('It is forbidden to create objects of the Character class');
});

test.each([
  [new Bowman(1)],
  [new Daemon(1)],
  [new Magician(1)],
  [new Swordsman(1)],
  [new Undead(1)],
  [new Vampire(1)],
])(('Не должно быть выброса ошибки'), (char) => {
  expect(() => char).not.toThrow();
});
