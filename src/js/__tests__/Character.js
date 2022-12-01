import Character from '../Character';
import Daemon from '../Characters/Daemon';
import Bowman from '../Characters/Bowman';
import Magician from '../Characters/Magician';

test('Создание объекта Character', () => {
  expect(() => new Character()).toThrow('Нельзя создать объект класса Character');
});

test('Создание персонажей должно быть без ошибок', () => {
  expect(() => new Bowman()).not.toThrow();
});

test('Создание персонажей должно быть без ошибок', () => {
  expect(() => new Magician()).not.toThrow();
});
test('Создание персонажей должно быть без ошибок', () => {
  expect(() => new Daemon()).not.toThrow();
});
