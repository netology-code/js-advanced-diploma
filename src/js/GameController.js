import {generateTeam} from './generators'
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman'
import Daemon from './characters/Daemon'
import Magician from './characters/Magician'
import Swordsman from './characters/Swordsman'
import Undead from './characters/Undead'
import Vampire from './characters/Vampire'

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    const goodcharacters = [Bowman, Magician, Swordsman];
    const badcharacters = [Daemon, Undead, Vampire];
    const goodteam = generateTeam(goodcharacters, 4, 3);
    const badteam = generateTeam(badcharacters, 4, 3);
    let pos = [];
    let posclosed = [];
    for (let i in goodteam.characters) {
      let position = this.randomPositiongood();
      if (!posclosed.includes(position)) {
        posclosed.push(position);
      } else {
        position = this.randomPositiongood();
      }
      pos.push(new PositionedCharacter(goodteam.characters[i], position));
    }
    for (let i in badteam.characters) {
      let position = this.randomPositionbad();
      if (!posclosed.includes(position)) {
        posclosed.push(position);
      } else {
        position = this.randomPositionbad();
      }
      pos.push(new PositionedCharacter(badteam.characters[i], position));
    }
    this.gamePlay.redrawPositions(pos);
    const cells = document.querySelectorAll('.cell');
    cells.forEach(item => {
      item.onmouseover = () => {
        for (let i = 0; i < cells.length; i++) {
          if(item == cells[i]) {
            this.gamePlay.addCellEnterListener(() => {this.onCellEnter(i)});
          }
        };
      }
    }) 

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    const cells = document.querySelectorAll('.cell');
    if(cells[index].childElementCount) {
      this.gamePlay.showCellTooltip('значение', index);
    }
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  randomPositiongood() {
    let i = 0;
    do {
      i = Math.floor(Math.random()*100);
    } while (!(i % 8 == 0) || (i > 57));
    if (Math.random() > 0.5) {
      i++;
    }
    return i;
  }

  randomPositionbad() {
    let i = 0;
    do {
      i = Math.floor(Math.random()*100);
    } while (!(i % 8 == 0) || (i > 57));
    if (Math.random() > 0.5) {
      i++;
    }
    let j = 0;
    j = i + 6;
    return j;
  }
}
