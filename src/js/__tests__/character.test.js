import Character from '../Character'

test('check error new Character', () => {
    expect(() => {
        const err = new Character('Lucifer', 'Daemon');
        console.log(err);
    }).toThrow("Объект класса Character не может создаваться конструкцией new");
})