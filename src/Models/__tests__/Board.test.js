import Board from '../Board';
import Ship from '../Ship';

describe('Board', () => {
  const { UNREVEALED, WATER, HIT } = Board.results();
  const { SUNKEN, GARAGE, FLOATING } = Ship.states();
  let board;

  beforeEach(() => {
    board = new Board();
  });

  describe('class', () => {
    it('can return cell types ENUMs', () => {
      expect(UNREVEALED).toBe(0);
      expect(WATER).toBe(1);
      expect(HIT).toBe(2);
    });

    it('constructs an instance correctly with default dimensions', () => {
      expect(board).not.toBe(undefined);
      expect(board.dim()).toBeEqual([10, 10]);
    });

    it('can verify if target is correct (not out of bounds, negative number or fraction)', () => {
      expect(Board.verifyTarget(board, [-1, 0])).toBe(false);
      expect(Board.verifyTarget(board, [0, 0.2])).toBe(false);
      expect(Board.verifyTarget(board, [10, 10])).toBe(false);
      expect(Board.verifyTarget(board, [0, 9])).toBe(true);
    });

    it('can verify boards or array with ship placements', () => {
      expect(Board.verifySetup(board)).toBe(true);
      expect(Board.verifySetup([
        {
          pos: [2, 3],
          ship: new Ship(shipTypes[0]),
        }, {
          pos: [2, 4],
          ship: new Ship(shipTypes[0]),
        },
      ])).toBe(false);
      expect(Board.verifySetup([
        {
          pos: [9, 9],
          ship: new Ship(shipTypes[0]),
        },
      ])).toBe(false);
    });

    it('can return available spots for given ship (size 4, horizontal orientation)', () => {
        expect(Board.availableSpots(board, new Ship(shipTypes[3]))).toBeEqual([
          [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
          [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
          [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
          [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
          [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
          [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6],
          [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
          [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6],
          [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6],
          [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6],
        ]);
      });
  });

  describe('instance', () => {
    /* [2,3] - 2; [5,6] -2 [row, col]
      [[- - - - - - - - - -]
       [- - o o o o - - - -]
       [- - o X X o - - - -]
       [- - o o o o - - - -]
       [- - - - - o o o o -]
       [- - - - - o X X o -]
       [- - - - - o o o o -]
       [- - - - - - - - - -]
       [- - - - - - - - - -]
       [- - - - - - - - - -]]
     */
    it('can return current state of itself', () => {
      expect(board.state()).toBeEqual([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]);
    });

    it('can return revealed state of itself', () => {
      expect(board.revealed()).toBeEqual([
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      ]);
    });

    it('can arrange ships randomly', () => {
      let seed = 0;
      board.random([
        new Ship(shipTypes[0]),
        new Ship(shipTypes[0]),
        new Ship(shipTypes[0]),
        new Ship(shipTypes[0]),
        new Ship(shipTypes[1]),
        new Ship(shipTypes[1]),
        new Ship(shipTypes[1]),
        new Ship(shipTypes[2]),
        new Ship(shipTypes[2]),
        new Ship(shipTypes[3]),
      ], seed);

      expect(Board.verifySetup(board)).toBe(true);
    });

    it('can be casted to a string', () => {
      expect(board.toString()).toBeEqual(
        ((new Array(10)).fill('[-, -, -, -, -, -, -, -, -, -]')).join('\n')
      );
    });

    describe('can be used to place a ship and it', () => {
      let ships;
      let shipTypes;

      beforeEach(() => {
        shipTypes = Ship.types();
        ships = [
          new Ship(shipTypes[0]),
          new Ship(shipTypes[0]),
        ];
        board.launch([2, 3], ships[0]);
      });

      it('can add an another ship', () => {
        expect(board.launch([5, 6], ships[1])).toBe(true);
        expect(board.ships().length).toBe(2);
        expect(board.ships()[0]).toBe(ships[0]);
        expect(board.ships()[1]).toBe(ships[1]);
      });

      it('cannot add an another ship in forbidden location', () => {
        expect(board.launch([10, 10], ships[1])).toBe(false);
        expect(board.launch([2, 3], ships[1])).toBe(false);
        expect(board.launch([2, 4], ships[1])).toBe(false);
        expect(board.ships().length).toBe(1);
      });

      it('can perform a shoot and return outcome of the try if the shoot was missed', () => {
        expect(board.shoot([5, 6])).toBe(WATER);
      });

      it('can perform couple shoots (hit and water) and save them in the local history', () => {
        expect(board.shoot([5, 6])).toBe(WATER);
        expect(board.shoot([7, 8])).toBe(WATER);
        expect(board.shoot([2, 4])).toBe(HIT);
        expect(board.shoot([5, 5])).toBe(WATER);
        expect(board.history()).toBeEqual([
          {
            result: WATER,
            pos: [5, 6],
          }, {
            result: WATER,
            pos: [7, 8],
          }, {
            result: HIT,
            pos: [2, 4],
          }, {
            result: WATER,
            pos: [5, 5],
          },
        ]);
      });

      it('can perform 2 hits and sink a ship', () => {
        expect(board.shoot([2, 3])).toBe(HIT);
        expect(board.shoot([2, 4])).toBe(HIT);
        expect(ships[0].state()).toBe(SUNKEN);
      });
    });
  });
});
