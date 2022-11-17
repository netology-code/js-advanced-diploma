/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const tableSize = boardSize ** 2;
  const lineSize = boardSize - 1;
  if (index === 0) {
    return 'top-left';
  }
  if (index === lineSize) {
    return 'top-right';
  }
  if (index > 0 && index < lineSize) {
    return 'top';
  }
  if (index === tableSize - 1 - lineSize) {
    return 'bottom-left';
  }
  if (index === tableSize - 1) {
    return 'bottom-right';
  }
  if (index > (tableSize - 1 - lineSize) && index < tableSize - 1) {
    return 'bottom';
  }
  if (index % boardSize === 0) {
    return 'left';
  }
  if ((index + 1) % boardSize === 0) {
    return 'right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
