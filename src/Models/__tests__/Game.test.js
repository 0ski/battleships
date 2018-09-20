import Player from '../Player';
import Game from '../Game';

describe('Game', () => {
  let game;
  let stateEnums;
  let player;

  beforeEach(() => {
    game = new Game();
    player = new Player();
  });

  describe('class', () => {
    it('constructs an instance correctly', () => {
      expect(game).not.toBe(undefined);
    });

    it('returns states ENUMs', () => {
      stateEnums = Game.states();
      expect(stateEnums).not.toBe(undefined);
    });
  });

  describe('instance', () => {
    it('can add a player in', () => {
      game.add(player);
      expect(game.players()[0]).toBe(player);
      expect(game.isPlayerIn(player)).toBe(true);
      expect(player.isInGame()).toBe(true);
      game.remove(player);
      expect(game.players()[0]).toBe(undefined);
      expect(game.isPlayerIn(player)).toBe(false);
      expect(player.isInGame()).toBe(false);
    });

    it('cannot add the same player twice', () => {
      game.add(player);
      game.add(player);
      expect(game.players().length).toBe(1);
    });

    it('can add multiple players', () => {
      let player2 = new Player();
      game.add(player);
      game.add(player2);
      expect(game.players().length).toBe(2);
      game.remove(player);
      expect(game.players().length).toBe(1);
      expect(game.isPlayerIn(player)).toBe(false);
      expect(game.isPlayerIn(player2)).toBe(true);
    });

    it('can start only after at least two players joined', () => {
      let started = game.start();
      expect(started).toBe(false);
      expect(game.state()).toBe(stateEnums.UNREADY);
      let player2 = new Player();
      game.add(player);
      game.add(player2);
      started = game.start();
      expect(started).toBe(true);
    });

    describe('with two players in', () => {
      let player2;

      beforeEach(() => {
        player2 = new Player();
        game.add(player);
        game.add(player2);
      });

      it('can start a game and move to READY state', () => {
        expect(game.state()).toBe(stateEnums.READY);
        let started = game.start();
        expect(started).toBe(true);
        expect(game.state()).toBe(stateEnums.PLACEMENT);
      });
    });
  });

});
