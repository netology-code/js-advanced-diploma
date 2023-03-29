const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',

  * [Symbol.iterator]() {
    for (const value of Object.values(this)) {
      yield value;
    }
  },
};

export default themes;
