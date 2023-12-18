import Bowman from '../characters/Bowman'
import Daemon from '../characters/Daemon'
import Magician from '../characters/Magician'
import Swordsman from '../characters/Swordsman'
import Undead from '../characters/Undead'
import Vampire from '../characters/Vampire'

test('Bowman create', () => {
    const player = new Bowman(1);
    const result = {
        attack: 25,
        defence: 25,
        health: 100,
        level: 1,
        type: "bowman"}
    expect(player).toEqual(result);
});

test('Daemon create', () => {
    const player = new Daemon(1);
    const result = {
        attack: 10,
        defence: 10,
        health: 100,
        level: 1,
        type: "daemon"}
    expect(player).toEqual(result);
});

test('Magician create', () => {
    const player = new Magician(1);
    const result = {
        attack: 10,
        defence: 40,
        health: 100,
        level: 1,
        type: "magician"}
    expect(player).toEqual(result);
});

test('Swordsman create', () => {
    const player = new Swordsman(1);
    const result = {
        attack: 40,
        defence: 40,
        health: 100,
        level: 1,
        type: "swordsman"}
    expect(player).toEqual(result);
});

test('Undead create', () => {
    const player = new Undead(1);
    const result = {
        attack: 40,
        defence: 10,
        health: 100,
        level: 1,
        type: "undead"}
    expect(player).toEqual(result);
});

test('Vampire create', () => {
    const player = new Vampire(1);
    const result = {
        attack: 25,
        defence: 25,
        health: 100,
        level: 1,
        type: "vampire"}
    expect(player).toEqual(result);
});