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
 *       game.finish() // player.win() player.lose()    FINISHED
*/

describe('Game', () => {
  let game;
  let player1;
  const STATE_ENUMS = Game.states();
  const SHIP_TYPES = Ship.types();
  const { UNREVEALED, WATER, HIT } = Board.results();

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

      await game.start();
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

      await ready;
      expect(game.state()).toBe(READY);
      let started = game.start();
      expect(game.state()).toBe(SETUP);
      await started;
      expect(game.state()).toBe(BATTLE);
    });

    describe('with two players in the game, with mocked verify functionality', () => {
      let player2;

      beforeEach(() => {
        game = new Game();
        player1 = new Player();
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
        await ready;
        expect(game.state()).toBe(READY);
        let start = game.start();
        expect(start instanceof Promise).toBe(true);
        await start;
        expect(game.state()).toBe(BATTLE);
      });

      it('can give boards to both players', async () => {
        const spy1 = jest.spyOn(player1, 'board');
        const spy2 = jest.spyOn(player2, 'board');
        await game.ready();
        await game.start();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(player1.board() instanceof Board).toBe(true);
        expect(player2.board() instanceof Board).toBe(true);
      });

      it('can call players to prepare their setup', async () => {
        const spy1 = jest.spyOn(player1, 'setup');
        const spy2 = jest.spyOn(player2, 'setup');
        await game.ready();
        await game.start();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
      });
    });

    describe('with two players in the game', () => {
      let player2;

      beforeEach(() => {
        game = new Game();
        player1 = new Player();
        player2 = new Player();
        player1.ready = player2.ready = () => true;
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

        game.add(player1);
        game.add(player2);
      });

      it('gives 3 tries to properly setup a board before concluding the game', async () => {
        game.verify = () => false;

        let spy = jest.spyOn(game, 'verify');
        await game.ready();
        expect(game.winners()).toEqual([]);
        expect(game.losers()).toEqual([]);
        await game.start();
        expect(spy).toHaveBeenCalledTimes(6);
        expect(game.state()).toBe(FINISHED);
        expect(game.losers()).toEqual([
          player1,
          player2,
        ]);
      });

      it('can progress to the next stage when both players complete their setup correctly' +
            ' with given array of ships', async () => {

        let spy = jest.spyOn(game, 'verify');

        await game.ready();
        await game.start();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(game.state()).toBe(BATTLE);
      });

      it('can progress to BATTLE state and start taking turns', async () => {
        player1.turn = () => ({ target: [9, 9], player: player2 });
        player2.turn = () => ({ target: [9, 9], player: player1 });
        let spy1 = jest.spyOn(player1, 'turn');
        let spy2 = jest.spyOn(player2, 'turn');

        await game.ready();
        await game.start();
        expect(game.currentPlayer()).toBe(player1);
        expect(game.state()).toBe(BATTLE);
        await game.turn();
        expect(game.currentPlayer()).toBe(player2);
        await game.turn();
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
      });

      it('can conclude the game if a player would not shoot into a valid target ' +
          '3 times in the row', async () => {
        player1.turn = player2.turn = opponents => ({ target: [9, 9], player: opponents[0] });
        let spy1 = jest.spyOn(player1, 'turn');
        let spy2 = jest.spyOn(player2, 'turn');

        await game.ready();
        await game.start();
        await game.turn(); //player1
        await game.turn(); //player2
        await game.turn(); //player1

        expect(game.state()).toBe(FINISHED);
        expect(spy2).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledTimes(4);
        expect(game.losers()).toEqual([
          player1,
        ]);
        expect(game.winners()).toEqual([
          player2,
        ]);
      });

      it('can allow player to shoot couple times if she/he hit a ship', async () => {
        function* gen() {
          yield [0, 1];
          yield [0, 2];
          yield [0, 3];
          yield [0, 4];

          //return [0, 5]; - that is invalid target as it's revelaed after sinking a ship
          return [0, 6];
        }

        let play1gen = gen();
        let play2gen = gen();
        player1.turn = opponents => ({ target: play1gen.next().value, player: opponents[0] });
        player2.turn = opponents => ({ target: play2gen.next().value, player: opponents[0] });

        let spy = jest.spyOn(player1, 'turn');

        await game.ready();
        await game.start();
        await game.turn();

        expect(spy).toHaveBeenCalledTimes(5);
        expect(_.last(player2.ships()).hitpoints()).toBe(0);
      });

      it('calls callback after hit is made', async () => {
        function* gen() {
          yield [0, 1];
          yield [0, 2];
          yield [0, 3];
          yield [0, 4];

          //return [0, 5]; - that is invalid target as it's revelaed after sinking a ship
          return [0, 6];
        }

        let play1gen = gen();
        let play2gen = gen();
        player1.turn = opponents => ({ target: play1gen.next().value, player: opponents[0] });
        player2.turn = opponents => ({ target: play2gen.next().value, player: opponents[0] });
        let callback = {
          cb: () => {},
        };
        let spy = jest.spyOn(callback, 'cb');

        await game.ready();
        await game.start(callback.cb);
        await game.turn();
        await game.turn();
        expect(spy).toHaveBeenCalledTimes(10);
      });

      it('accepts async callbacks and respects them', async () => {
        function* gen() {
          yield [0, 1];
          yield [0, 2];
          yield [0, 3];
          yield [0, 4];

          //return [0, 5]; - that is invalid target as it's revelaed after sinking a ship
          return [0, 6];
        }

        let play1gen = gen();
        let play2gen = gen();
        player1.turn = opponents => ({ target: play1gen.next().value, player: opponents[0] });
        player2.turn = opponents => ({ target: play2gen.next().value, player: opponents[0] });
        let callback = {
          cb: () => new Promise(res => {
            setTimeout(() => {
              res();
            }, 1);
          }),
        };
        let spy = jest.spyOn(callback, 'cb');

        await game.ready();
        await game.start(callback.cb);
        await game.turn();
        await game.turn();
        expect(spy).toHaveBeenCalledTimes(10);
      });

      it('can save moves in history and pass previous shoot state for player\'s turn fun.',
        async () => {

        function* gen() {
          yield [0, 1];
          return [0, 5];
        }

        let prevHIT;
        let prevWATER;

        let play1gen = gen();
        let play2gen = gen();
        player1.turn = (opponents, prevShootState) => {
          if (prevShootState.state === HIT) {
            prevHIT = prevShootState;
          }

          return { target: play1gen.next().value, player: opponents[0] };
        };

        player2.turn = (opponents, prevShootState) => {
          if (prevShootState.state === WATER) {
            prevWATER = prevShootState;
          }

          return { target: play2gen.next().value, player: opponents[0] };
        };

        await game.ready();
        await game.start();
        await game.turn(); //p1
        await game.turn(); //p2

        let player1Hist = game.history(player1);
        let player2Hist = game.history(player2);

        expect(game.history().length).toBe(4);
        expect(player1Hist.length).toBe(2);
        expect(player2Hist.length).toBe(2);
        expect(player1Hist[0].result).toBe(HIT);
        expect(player2Hist[1].result).toBe(WATER);
        expect(player1Hist[0].turn).toBe(0);
        expect(player1Hist[1].turn).toBe(0);
        expect(player2Hist[0].turn).toBe(1);
        expect(player2Hist[1].turn).toBe(1);
      });

      it('can pass all the stages and take the whole battle, finish it at some point',
        async () => {

        //Both players have the same boards, and make the same moves, so player1 always wins
        let spy1 = jest.spyOn(player1, 'win');
        let spy2 = jest.spyOn(player2, 'lose');

        let random = seedrandom(0);
        let turn = opponents => {
          let board = opponents[0].board();

          let available = board.unrevealedCells();
          let pos = available[Math.floor(random() * 229) % available.length];

          return {
            player: opponents[0],
            target: pos,
          };
        };

        player1.turn = turn;
        player2.turn = turn;

        await game.ready();
        await game.start();

        let i = 0;

        while (game.state() !== FINISHED && i < 201) {
          await game.turn();
          i++;
        }

        expect(i).toBeLessThan(201);

        expect(game.winners()[0]).toEqual(player1);
        expect(game.losers()[0]).toEqual(player2);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

      });
    });
  });

});
