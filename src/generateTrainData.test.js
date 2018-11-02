// import _ from 'lodash';
// import fs from 'fs';
// import * as tf from '@tensorflow/tfjs';
//
// import Board from './Models/Board';
// import Game from './Models/Game';
// import Ship from './Models/Ship';
// import MediumAI from './AI/MediumAI';
// import ConvNLAI from './AI/ConvNLAI';
//
// import * as trainingData from './static/trainingData.json';
//
// const { HORIZONTAL, VERTICAL } = Ship.shapes();
// const RESULTS = Board.results();
// const PRIME = 229;
// const dim = Game.defaultDim();
//
// const shipsToSink = board => board.ships()
//         .filter(item => item.ship.hitpoints())
//         .sort((a, b) => a.ship.size() < b.ship.size());
//
// const createBoardState = async () => {
//   let player = new MediumAI();
//   let board = new Board(dim);
//   let shipTypes = Game.defaultShipTypesList();
//   let ships = shipTypes.map(type => new Ship(type));
//
//   player.board(board);
//
//   await player.setup(ships);
//
//   let noOfMoves = Math.floor(Math.random() * PRIME % 90); //Don't want to reveal the whole board
//   let stopOnHIT = !(Math.floor(Math.random() * PRIME % 10)); //0.1 chance to stop on HIT
//   let prevShoot = {};
//   let target;
//   let ship;
//   let nextValidTarget;
//
//   for (let i = 0; i < noOfMoves; i++) {
//     prevShoot = await player._turn([player], prevShoot);
//     prevShoot = {
//       ...prevShoot,
//       ...player.board().shoot(prevShoot.target),
//     };
//
//     if (stopOnHIT && prevShoot.result === RESULTS.HIT) {
//       break;
//     }
//
//     if (prevShoot.result === RESULTS.SINK &&
//       player.floatingShips().length === 1
//     ) {
//       break;
//     }
//   }
//
//   let i = 0;
//   let shipsToSinkArr = shipsToSink(player.board());
//   if (prevShoot.result === RESULTS.HIT) {
//     let { ship, pos } = shipsToSinkArr.find(item => item.ship === prevShoot.ship);
//     let state = player.board().state();
//
//     if (state[pos[1]][pos[0]] === RESULTS.UNREVEALED) {
//       while (nextValidTarget === undefined && i < 5) {
//         if (
//           ship.shape() === HORIZONTAL &&
//           state[pos[1]][pos[0] + i] === RESULTS.HIT
//         ) {
//           nextValidTarget = [pos[0] + i - 1, pos[1]];
//         } else if (
//           ship.shape() === VERTICAL &&
//           state[pos[1] + i][pos[0]] === RESULTS.HIT
//         ) {
//           nextValidTarget = [pos[0], pos[1] + i - 1];
//         } else {
//           i++;
//         }
//       }
//     } else {
//       while (nextValidTarget === undefined && i < 5) {
//         if (
//           ship.shape() === HORIZONTAL &&
//           state[pos[1]][pos[0] + i] === RESULTS.UNREVEALED
//         ) {
//           nextValidTarget = [pos[0] + i, pos[1]];
//         } else if (
//           ship.shape() === VERTICAL &&
//           state[pos[1] + i][pos[0]] === RESULTS.UNREVEALED
//         ) {
//           nextValidTarget = [pos[0], pos[1] + i];
//         } else {
//           i++;
//         }
//       }
//     }
//   } else {
//     ship = shipsToSinkArr[0];
//     nextValidTarget = ship.pos;
//   }
//
//   return {
//     data: _.flatten(player.board().state()),
//     label: prepareLabels(nextValidTarget, player.board().state(), player.board().setup()),
//   };
// };
//
// const prepareLabels = (nextValidTarget, boardState, boardSetup) => {
//   let noOfPointsToHit = 0;
//   let hotPoints = boardSetup.map(
//     (row, rowId) => row.map((cell, colId) => {
//       if (cell === RESULTS.SINK && boardState[rowId][colId] === RESULTS.UNREVEALED) {
//         noOfPointsToHit++;
//         return 1;
//       } else {
//         return 0;
//       }
//     })
//   );
//
//   hotPoints = hotPoints.map(row => row.map(
//     cell => (cell * 0.4) / noOfPointsToHit
//   ));
//
//   hotPoints[nextValidTarget[1]][nextValidTarget[0]] = 0.6;
//
//   return _.flatten(hotPoints);
// };
//
// xit('Create data and save it', async () => {
//   const NO_OF_BOARDS = 128000;
//   const { data, labels } = trainingData.default;
//
//   for (let i = 0; i < NO_OF_BOARDS; i++) {
//     let out = await createBoardState();
//     data.push(out.data);
//     labels.push(out.label);
//   }
//
//   await fs.writeFile('./src/static/trainingData2.json', JSON.stringify({
//     data,
//     labels,
//   }), function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });
//
//   expect(1).toBe(1);
// });
