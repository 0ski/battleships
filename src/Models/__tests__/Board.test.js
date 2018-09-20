import Board from '../Board';

describe('Board', () => {
  let board;

  beforeEach(() => {
    cellTypes = Board.cellTypes();
    board = new Board();
  });

  describe('class', () => {
    it('can return cell types ENUMs', () => {
      expect(cellTypes).toBeDefined();
      expect(typeof cellTypes).toBe('object');
    });

    it('constructs an instance correctly with default dimension', () => {
      expect(board).not.toBe(undefined);
      expect(board.dimension()).toBeEqual([10, 10]);
    });

    it('can verify if target is correct (not out of bounds, negative number or fraction)', () => {
      expect(Board.verifyTarget([-1, 0], board)).toBe(false);
      expect(Board.verifyTarget([0, 0.2], board)).toBe(false);
      expect(Board.verifyTarget([10, 10], board)).toBe(false);
      expect(Board.verifyTarget([0, 9], board)).toBe(true);
    });

    it('can verify boards or array with ship placements', () => {
      expect(Board.verifyBoard(board)).toBe(true);
      expect(Board.verifyBoard([
        {
          pos: [2, 3],
          ship: new Ship(shipTypes[0]),
        }, {
          pos: [2, 4],
          ship: new Ship(shipTypes[0]),
        },
      ])).toBe(false);
      expect(Board.verifyBoard([
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
    let ships;
    let shipTypes;

    beforeEach(() => {
      shipTypes = Ship.types();
      ships = [
        new Ship(shipTypes[0]),
        new Ship(shipTypes[0]),
      ];
    });

    it('can be used to place a ship', () => {
      board.place([2, 3], ships[0]);
      expect(board.ships().length).toBe(1);
      board.place([5, 6], ship[1]);
      expect(board.ships().length).toBe(2);
      expect(board.ships()[0]).toBe(ships[0]);
      expect(board.ships()[1]).toBe(ships[1]);
    });

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
      expect(board.currentState()).toBeEqual([
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

    it('can be casted to string', () => {
      expect(board.toString()).toBeEqual(
        ((new Array(10)).fill('[-, -, -, -, -, -, -, -, -, -]')).join('\n')
      );
    });

    it('can return history of hits', () => {
      board.hits().toBeEqual([]);
    });
  });
});
