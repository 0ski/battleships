import _ from 'lodash';
import seedrandom from 'seedrandom';

import Player from '../Player';
import Game from '../Game';
import Ship from '../Ship';
import Board from '../Board';

/*
Game flow:
 * Players enter the game
 * Game is in UNREADY state
 * If two or more players are ready, the game changes status to READY
 * Game asks players if they're ready, if both signalize 'ready', game moves to the next stage
 * Game status changes to SETUP
 * Game adds boards to its players
 * Game calls players' functions to setup ships on the given boards
 * Game verifies boards
 * If all boards are correct game move to the next stage - BATTLE
 * If some boards are invalid, game asks player to setup board once again
 * If after 3 attempts board is still invalid game changes state to - FINISHED
 * players with invalid board lose, players with valid board win
 * In BATTLE stage game instance changes turns and asks players to make their moves
 * when player shoots and hits a target, she/he gets an another turn
 * Game continues doing so till one board is without any floating ship left
 * Once a board is cleared from floated ships, it concludes the game
 * Game changes status to FINISHED
 * Note: Game class is a framework for Player class API
 * Note: Each Player function which is called from the Game class can return either a value
 *       or a promise
 * Note: Player functions called chronologically:
 *       ready()
 *       board()
 *       setup()
 *       turn()
 *       finish() ?
 * Note: Flow of the game:                              [STATE]
 *       game = new Game({dim, shipTypes[]})            UNREADY
 *       game.add(player1)                              UNREADY
 *       game.add(player2)                              UNREADY
 *       game.ready() // players[].ready()              READY
 *       game.start() // players[].board(board)         SETUP
 *                    // players[].setup(ships)         BATTLE
 *       game.turn() // player.turn()                   BATTLE
 *                   // game.shoot(pos)                 BATTLE
 *       game.finish() // player.win() player.lose()    FINISHED
*/

describe('Game', () => {
  let game;
  let player1;
  const STATE_ENUMS = Game.states();
  const SHIP_TYPES = Ship.types();

  let {
    UNREADY,
    READY,
    SETUP,
    BATTLE,
    FINISHED,
  } = STATE_ENUMS;

  beforeEach(() => {
    game = new Game({
      shipTypes: [
        new Ship(SHIP_TYPES[0]),
        new Ship(SHIP_TYPES[0]),
        new Ship(SHIP_TYPES[0]),
        new Ship(SHIP_TYPES[0]),
        new Ship(SHIP_TYPES[1]),
        new Ship(SHIP_TYPES[1]),
        new Ship(SHIP_TYPES[1]),
        new Ship(SHIP_TYPES[2]),
        new Ship(SHIP_TYPES[2]),
        new Ship(SHIP_TYPES[3]),
      ],
    });
    player1 = new Player();
    player1.ready = () => true;
  });

  describe('class', () => {
    it('constructs an instance correctly', () => {
      expect(game).not.toBe(undefined);
    });

    it('returns states ENUMs', () => {
      expect(STATE_ENUMS).not.toBe(undefined);
    });
  });

  describe('instance', () => {
    it('can add a player in', () => {
      game.add(player1);
      expect(game.players()[0]).toBe(player1);
      expect(game.isPlayerIn(player1)).toBe(true);
      expect(player1.isInGame()).toBe(true);
      game.remove(player1);
      expect(game.players()[0]).toBe(undefined);
      expect(game.isPlayerIn(player1)).toBe(false);
      expect(player1.isInGame()).toBe(false);
    });

    it('cannot add the same player twice', () => {
      game.add(player1);
      game.add(player1);
      expect(game.players().length).toBe(1);
    });

    it('can add and remove players', () => {
      let player2 = new Player();
      player2.ready = () => true;
      game.add(player1);
      game.add(player2);
      expect(game.players().length).toBe(2);
      game.remove(player1);
      expect(game.players().length).toBe(1);
      expect(game.isPlayerIn(player1)).toBe(false);
      expect(game.isPlayerIn(player2)).toBe(true);
    });

    it('can start only after at least two players joined and signalized ready', async () => {
      game.verify = () => true;

      expect(game.start()).toBe(false);
      expect(game.state()).toBe(UNREADY);
      let player2 = new Player();
      game.add(player1);
      game.add(player2);

      player1.ready = player2.ready = () => true;
      player1.board = player2.board = () => true;
      player1.setup = player2.setup = () => true;

      expect(game.state()).toBe(UNREADY);
      let ready = game.ready();
      expect(ready).not.toBe(false);

      await ready.then(() => {
        expect(game.state()).toBe(READY);
        let started = game.start();
        expect(game.state()).toBe(SETUP);
        return started.then(() => {
          expect(game.state()).toBe(BATTLE);
        });
      });
    });

    describe('with two players in the game, with mocked verify functionality', () => {
      let player2;

      beforeEach(() => {
        player2 = new Player();
        player1.ready = player2.ready = () => true;
        game.add(player1);
        game.add(player2);
        game.verify = () => true;
      });

      it('can ask players if they are ready', () => {
        const spy1 = jest.spyOn(player1, 'ready');
        const spy2 = jest.spyOn(player2, 'ready');

        game.ready();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
      });

      it('can move to READY state and start the battle with ship SETUP stage', async () => {
        let ready = game.ready();
        expect(ready instanceof Promise).toBe(true);
        await ready.then(() => {
          expect(game.state()).toBe(READY);
          let start = game.start();
          expect(start instanceof Promise).toBe(true);
          expect(game.state()).toBe(SETUP);
          return start.then(() => {
            expect(game.state()).toBe(BATTLE);
          });
        });
      });

      it('can give boards to both players', async () => {
        let ready = game.ready();

        await ready.then(() => {
          const spy1 = jest.spyOn(player1, 'board');
          const spy2 = jest.spyOn(player2, 'board');

          return game.start().then(() => {
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            expect(player1.board() instanceof Board).toBe(true);
            expect(player2.board() instanceof Board).toBe(true);
          });
        });
      });

      it('can call players to prepare their setup', async () => {
        let ready = game.ready();

        await ready.then(() => {
          const spy1 = jest.spyOn(player1, 'setup');
          const spy2 = jest.spyOn(player2, 'setup');

          return game.start().then(() => {
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
          });
        });
      });

    });

    describe('with two players in the game', () => {
      let player2;

      beforeEach(() => {
        player2 = new Player();
        player1.ready = player2.ready = () => true;
        game.add(player1);
        game.add(player2);
      });

      it('gives 3 tries to properly setup a board before concluding the game', async () => {
        let spy = jest.spyOn(game, 'verify');
        let ready = game.ready();

        await ready.then(() => {
          expect(game.winners()).toEqual([]);
          expect(game.losers()).toEqual([]);
          return game.start().then(() => {
            expect(spy).toHaveBeenCalledTimes(6);
            expect(game.state()).toBe(FINISHED);
            expect(game.losers()).toEqual([
              player1,
              player2,
            ]);
          });
        });
      });

      let setup = () => {
        player1.setup = (ships) => {
          let board = player1.board();
          board.launchRandomly(ships, { seed: 0 });

          return board;
        };

        player2.setup = (ships) => {
          let board = player2.board();
          board.launchRandomly(ships, { seed: 0 });

          return board;
        };
      };

      it('can progress to the next stage when both players complete their setup correctly' +
            ' with given array of ships', () => {

        let spy = jest.spyOn(game, 'verify');

        game.ready();
        setup();
        game.start();

        expect(spy).toHaveBeenCalledTimes(2);
        expect(game.state()).toBe(BATTLE);
      });

      it('can progress to BATTLE state and start taking turns', () => {
        game.ready();
        setup();
        game.start();
        player1.turn = () => [5, 5];
        let spy = jest.spyOn(player1, 'turn');

        expect(game.currentPlayer()).toBe(player1);
        game.turn();
        expect(game.currentPlayer()).toBe(player2);
        expect(spy).toHaveBeenCalled();

      });

      it('can pass all the stages and take the whole battle, finish it at some point', () => {
        setup();
        let random = seedrandom(0);
        let turn = (game, opponentsBoardState) => {
          let state = opponentsBoardState;

          let available = state.map(
            (row, rowId) => row.map(
              (cell, colId) => cell === UNREVEALED ? [colId, rowId] : null
            )
          );

          available = _.flatten(available).filter(item => item !== null);
          let pos = available[Math.floor(random() * 229) % available.length];

          game.shoot(pos);
        };

        player1.turn = turn;
        player2.turn = turn;

        game.ready();
        game.start();

        while (game.state() !== FINISHED) {
          game.turn();
        }

        player1.lose = player2.lose = player1.win = player2.win = () => undefined;

        let spy1 = jest.spyOn(player1, 'lose');
        let spy2 = jest.spyOn(player2, 'win');

        game.finish();

        expect(game.losers()[0]).toEqual(player1);
        expect(game.winners()[0]).toEqual(player2);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

      });
    });
  });

});
