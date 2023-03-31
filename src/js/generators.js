import { randomFromRange } from './utils';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export default function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const level = randomFromRange(1, maxLevel);
    const index = randomFromRange(0, allowedTypes.length - 1);

    yield new allowedTypes[index](level);
  }
}
