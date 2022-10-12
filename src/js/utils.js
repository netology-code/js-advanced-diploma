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
  let tileType = 'center';

  if (Number.isInteger((boardSize * boardSize - index) / boardSize)) {
    tileType = 'left';
  }
  if (Number.isInteger((boardSize * boardSize - index - 1) / boardSize)) {
    tileType = 'right';
  }
  if (index === 0) {
    tileType = 'top-left';
  }
  if (index > 0 && index < boardSize) {
    tileType = 'top';
  }
  if (index === boardSize - 1) {
    tileType = 'top-right';
  }
  if (index === boardSize * boardSize - boardSize) {
    tileType = 'bottom-left';
  }
  if (index > boardSize * boardSize - boardSize) {
    tileType = 'bottom';
  }
  if (index === boardSize * boardSize - 1) {
    tileType = 'bottom-right';
  }

  return tileType;
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
