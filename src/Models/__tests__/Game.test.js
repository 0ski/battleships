import _ from 'lodash';
import seedrandom from 'seedrandom';

import Player from '../Player';
import Game from '../Game';
import Ship from '../Ship';

/*
Game flow:
 * Players enter the game
 * Game is in UNREADY state
 * If two or more players are ready, the game changes status to READY
 * Game asks players if they're ready, if both signalize 'ready', game moves to the next stage
 * Game status changes to PLACEMENT
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
 *       isReady()
 *       board()
 *       setup()
 *       turn()
 *       finish() ?
*/

describe('Game', () => {
  let game;
  let player1;
  const STATE_ENUMS = Game.states();
  const SHIP_TYPES = Ship.types();

  let {
    UNREADY,
    READY,
    PLACEMENT,
    BATTLE,
    FINISHED,
  } = STATE_ENUMS;

  beforeEach(() => {
    game = new Game([
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
    ]);
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

    it('can add multiple players', () => {
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

    it('can start only after at least two players joined', () => {
      expect(game.start()).toBe(false);
      expect(game.state()).toBe(UNREADY);
      let player2 = new Player();
      game.add(player1);
      game.add(player2);
      started = game.start();
      expect(started).toBe(true);
      expect(game.turn()).toBe(player1);
    });

    describe('with two players in', () => {
      let player2;

      beforeEach(() => {
        player2 = new Player();
        game.add(player1);
        game.add(player2);
      });

      it('can ask players if they are ready', () => {
        const spy1 = jest.spyOn(player1, 'ready');
        const spy2 = jest.spyOn(player2, 'ready');

        game.ready();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
      });

      it('can move to READY state and start battle with ship placement stage', () => {
        expect(game.ready()).toBe(true);
        expect(game.state()).toBe(READY);
        expect(game.start()).toBe(true);
        expect(game.state()).toBe(PLACEMENT);
      });

      it('can give boards to both players', () => {
        game.ready();

        const spy1 = jest.spyOn(player1, 'board');
        const spy2 = jest.spyOn(player2, 'board');

        game.start();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(player1.board() instanceof Board).toBe(true);
        expect(player2.board() instanceof Board).toBe(true);
      });

      it('can call players to prepare their setup', () => {
        game.ready();

        const spy1 = jest.spyOn(player1, 'setup');
        const spy2 = jest.spyOn(player2, 'setup');

        game.start();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
      });

      it('gives 3 tries to properly setup a board before concluding the game', () => {
        let spy = jest.spyOn(game, 'verify');
        game.ready();
        game.start();
        expect(spy).toHaveBeenCalledTimes(6);
        expect(game.state()).toBe(FINISHED);
        expect(game.losers()).toBeEqual([
          player1,
          player2,
        ]);
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

        expect(game.losers()[0]).toEqual(player1);
        expect(game.winners()[0]).toEqual(player2);

      });
    });
  });

});
