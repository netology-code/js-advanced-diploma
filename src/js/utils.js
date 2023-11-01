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
  switch (true) {
    case index === 0:
      return 'top-left';
    case index === boardSize - 1:
      return 'top-right';
    case index === boardSize * (boardSize - 1):
      return 'bottom-left';
    case index === boardSize * boardSize - 1:
      return 'bottom-right';
    case index > 0 && index < boardSize:
      return 'top';
    case index % boardSize === 0:
      return 'left';
    case (index + 1) % boardSize === 0:
      return 'right';
    case index > boardSize * (boardSize - 1) && index < boardSize * boardSize - 1:
      return 'bottom';
    default:
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

/* eslint-disable-next-line */
export function calcBorderSide(currIdx, arrayIndexes, boardSize) {
  const topLeft = Math.min(...arrayIndexes);
  const bottomRight = Math.max(...arrayIndexes);
  if (currIdx === topLeft) {
    return 'top-left';
  }
  if (currIdx === bottomRight) {
    return 'bottom-right';
  }
  let currentValue = topLeft + boardSize;
  while (currentValue < bottomRight - boardSize) {
    if (currIdx === currentValue) {
      return 'left';
    }
    currentValue += boardSize;
  }
  const bottomLeft = currentValue;
  if (currIdx === bottomLeft) {
    return 'bottom-left';
  }
  currentValue = bottomRight - boardSize;
  while (currentValue > topLeft + boardSize) {
    if (currIdx === currentValue) {
      return 'right';
    }
    currentValue -= boardSize;
  }
  const topRight = currentValue;
  if (currIdx === topRight) {
    return 'top-right';
  }
  if (currIdx > topLeft && currIdx < topRight) {
    return 'top';
  }
  if (currIdx > bottomLeft && currIdx < bottomRight) {
    return 'bottom';
  }
}
