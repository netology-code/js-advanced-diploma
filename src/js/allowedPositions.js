export default function positions(position, distance, boardSize) {
  const positionsArray = [];
  const row = Math.floor(position / boardSize);
  const column = position % boardSize;
  for (let i = 1; i <= distance; i += 1) {
    if ((column + i) < 8) {
      positionsArray.push((row * 8) + (column + i));
    }
    if ((column - i) >= 0) {
      positionsArray.push((row * 8) + (column - i));
    }
    if ((row + i) < 8) {
      positionsArray.push(((row + i) * 8) + column);
    }
    if ((row - i) >= 0) {
      positionsArray.push(((row - i) * 8) + column);
    }
    if ((row + i) < 8 && (column + i) < 8) {
      positionsArray.push(((row + i) * 8) + (column + i));
    }
    if ((row - i) >= 0 && (column - i) >= 0) {
      positionsArray.push(((row - i) * 8) + (column - i));
    }
    if ((row + i) < 8 && (column - i) >= 0) {
      positionsArray.push(((row + i) * 8) + (column - i));
    }
    if ((row - i) >= 0 && (column + i) < 8) {
      positionsArray.push(((row - i) * 8) + (column + i));
    }
  }
  return positionsArray;
}
