import nj from 'numjs';
import fs from 'fs';

import Board from './Models/Board';
import Game from './Models/Game';
import Ship from './Models/Ship';
const PRIME = 229;

const NO_OF_BOARDS = PRIME;
const dim = Game.defaultDim();
let boardCellData = nj.ones(dim);
let ships = Game.defaultShipTypesList().map(type => new Ship(type));

fit('', () => {
  for (let i = 1; i <= NO_OF_BOARDS; i++) {
    let board = new Board();
    if (board.launchRandomly(ships, { seed: i })) {
      boardCellData = boardCellData.add(nj.array(board.setup()).subtract(1).divide(2));
    }
  }

  fs.writeFile('data.json', JSON.stringify(boardCellData.tolist()), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  expect(1).toBe(1);
});
