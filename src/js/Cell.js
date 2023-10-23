

export default class Cell {
  constructor(cellEl) {
    const charEl = cellEl.querySelector('.character');
    if (charEl) {
      this.isEmpty = false;
      this.charEl = charEl;
      if (charEl.classList.contains('swordsman')) {
        this.character = 'swordsman';
        this.charHikeRange = 4;
        this.charAttackRange = 1;
      } else if (charEl.classList.contains('bowman')) {
        this.character = 'bowman';
        this.charHikeRange = 2;
        this.charAttackRange = 2;
      } else if (charEl.classList.contains('magician')) {
        this.character = 'magician';
        this.charHikeRange = 1;
        this.charAttackRange = 4;
      } else if (charEl.classList.contains('undead')) {
        this.character = 'undead';
        this.charHikeRange = 4;
        this.charAttackRange = 1;
      } else if (charEl.classList.contains('vampire')) {
        this.character = 'vampire';
        this.charHikeRange = 2;
        this.charAttackRange = 2;
      } else if (charEl.classList.contains('daemon')) {
        this.character = 'daemon';
        this.charHikeRange = 1;
        this.charAttackRange = 4;
      }
      this.role = this.character === 'swordsman' || this.character === 'bowman' || this.character === 'magician' ? 'ally' : 'enemy';
      if (cellEl.classList.contains('selected')) {
        this.isSelected = true;
      }
    } else {
      this.isEmpty = true;
      this.character = null;
      this.charEl = null;
      this.role = null;
      this.isSelected = false;
      this.charHikeRange = 0;
      this.charAttackRange = 0;
    }
  }
}

