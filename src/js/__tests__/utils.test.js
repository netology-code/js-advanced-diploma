import {calcTileType} from '../utils'

test('check method calcTileType', () => {
    const result0 = calcTileType(0, 8);
    expect('top-left').toBe(result0);
    const result1 = calcTileType(1, 8);
    expect('top').toBe(result1);
    const result2 = calcTileType(7, 8);
    expect('top-right').toBe(result2);
    const result3 = calcTileType(8, 8);
    expect('left').toBe(result3);
    const result4 = calcTileType(15, 8);
    expect('right').toBe(result4);
    const result5 = calcTileType(56, 8);
    expect('bottom-left').toBe(result5);
    const result6 = calcTileType(57, 8);
    expect('bottom').toBe(result6);
    const result7 = calcTileType(63, 8);
    expect('bottom-right').toBe(result7);
})