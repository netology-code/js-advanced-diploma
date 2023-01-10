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
  const cells = boardSize ** 2;
  const top = (index < boardSize) ? 'top' : null;
  const bottom = (index >= cells - boardSize) ? 'bottom' : null
  const left = (index % boardSize === 0) ? 'left' : null;
  const right = (index % boardSize === boardSize - 1) ? 'right' : null;
  if ( (top || bottom) && (left || right) ) {
    return `${ (top || bottom) }-${ (left || right) }`
  } else if ( top || bottom || left || right ) {
    return top || bottom || left || right;
  } else {
    return 'center';
  }
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
