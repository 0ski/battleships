import Player from '../Player';
import Game from '../Game';

describe('Player', () => {
  let game;
  let player;

  beforeEach(() => {
    game = new Game();
    player = new Player();
  });

  describe('class', () => {
    it('constructs an instance correctly', () => {
      expect(player).not.toBe(undefined);
    });
  });

  describe('instance', () => {
    it('can enter and leave a game', () => {
      player.enter(game);
      expect(player.isInGame()).toBe(true);
      player.leave();
      expect(player.isInGame()).toBe(false);
    });
  });

});
