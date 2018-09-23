import Board from '../Board';
import Ship from '../Ship';

describe('Board', () => {
  const { UNREVEALED, WATER, HIT } = Board.results();
  const UN = UNREVEALED;
  const { SUNKEN, GARAGE, FLOATING } = Ship.states();
  const SHIP_TYPES = Ship.types();

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
      expect(board.dim()).toEqual([10, 10]);
    });

    it('can verify if target is correct (not out of bounds, negative number or a fraction)', () => {
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
          ship: new Ship(SHIP_TYPES[0]),
        }, {
          pos: [2, 4],
          ship: new Ship(SHIP_TYPES[0]),
        },
      ])).toBe(false);
      expect(Board.verifySetup([
        {
          pos: [9, 9],
          ship: new Ship(SHIP_TYPES[1]),
        },
      ])).toBe(false);
    });

    it('can return available spots for given ship (size 4, horizontal orientation)', () => {
        expect(Board.availableSpots(board, new Ship(SHIP_TYPES[3]))).toEqual([
          [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
          [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
          [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
          [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
          [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
          [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
          [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
          [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
          [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8],
          [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9],
        ]);
      });

    it('can return available spots for given ship (size 4, vertical orientation)', () => {
        let ship = new Ship(SHIP_TYPES[3]);
        ship.rotate();
        expect(Board.availableSpots(board, ship)).toEqual([
          [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0],
          [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],
          [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2],
          [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3],
          [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4],
          [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
          [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6],
        ]);
      });
  });

  describe('instance', () => {
    it('can return current state of itself', () => {
      //UN=UNREVEALED
      expect(board.state()).toEqual([
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
        [UN, UN, UN, UN, UN, UN, UN, UN, UN, UN],
      ]);
    });

    it('can return revealed state of itself', () => {
      expect(board.setup()).toEqual([
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
      ]);
    });

    it('can arrange ships randomly, with given seed', () => {
      let seed = 0;
      let keepShape = false;
      let isPossible = board.launchRandomly([
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
      ], {
        seed,
        keepShape,
      });

      let newBoard = new Board();
      let isPossible2 = newBoard.launchRandomly([
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
      ], {
        seed,
        keepShape,
      });

      expect(Board.verifySetup(board)).toBe(true);
      expect(Board.verifySetup(newBoard)).toBe(true);

      expect(board.setup()).toEqual(newBoard.setup());
    });

    it('can arrange ships randomly, with given seed, sink all the ships, with hitting all cells' +
        'and print pretty setup with pretty end status, status and setup must equal', () => {
      let seed = 5;
      let keepShape = false;
      let ships = [
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
      ];
      let isPossible = board.launchRandomly(ships, {
        seed,
        keepShape,
      });

      let dim = board.dim();
      let [totalCol, totalRow] = dim;

      for (let col = 0; col < totalCol; col++) {
        for (let row = 0; row < totalRow; row++) {
          board.shoot([col, row]);
        }
      }

      expect(board.toString()).toBe(board.setupToString());
    });

    it('cannot add the same ship instance twice', () => {
      let sloop = new Ship(SHIP_TYPES[0]);

      expect(board.launch([0, 0], sloop)).toBe(true);
      expect(board.launch([9, 9], sloop)).toBe(false);
    });

    it('can remove the ship instance from board and launch it again', () => {
      let sloop = new Ship(SHIP_TYPES[0]);

      expect(board.launch([0, 0], sloop)).toBe(true);
      expect(board.remove(sloop)).toBe(sloop);
      expect(board.launch([9, 9], sloop)).toBe(true);
    });

    describe('can arrange ships sticking to corners and', () => {
      let sloop;
      let brig;
      let frigate;
      let galleon;

      beforeEach(() => {
        sloop = new Ship(SHIP_TYPES[0]);
        brig = new Ship(SHIP_TYPES[1]);
        frigate = new Ship(SHIP_TYPES[2]).rotate();
        galleon = new Ship(SHIP_TYPES[3]).rotate();
        board = new Board();

        expect(board.launch([9, 9], sloop)).toBe(true);
        expect(board.launch([0, 9], brig)).toBe(true);
        expect(board.launch([0, 0], frigate)).toBe(true);
        expect(board.launch([9, 0], galleon)).toBe(true);
      });

      it('print pretty and correct setup', () => {
        expect(board.setupToString()).toBe(['[ X ~ ~ ~ ~ ~ ~ ~ ~ X ]',
                                            '[ X ~ ~ ~ ~ ~ ~ ~ ~ X ]',
                                            '[ X ~ ~ ~ ~ ~ ~ ~ ~ X ]',
                                            '[ ~ ~ ~ ~ ~ ~ ~ ~ ~ X ]',
                                            '[ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ]',
                                            '[ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ]',
                                            '[ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ]',
                                            '[ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ]',
                                            '[ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ]',
                                            '[ X X ~ ~ ~ ~ ~ ~ ~ X ]',
                                          ].join('\n'));
      });

      it('hit them to get them all and mark state correctly', () => {
        expect(board.shoot([9, 9])).toEqual({
          result: HIT,
          sink: true,
          ship: sloop,
        }); //sloop
        expect(board.shoot([0, 9])).toEqual({
          result: HIT,
          sink: false,
          ship: brig,
        }); //brig
        expect(board.shoot([1, 9])).toEqual({
          result: HIT,
          sink: true,
          ship: brig,
        }); //brig
        expect(board.shoot([0, 0])).toEqual({
          result: HIT,
          sink: false,
          ship: frigate,
        }); //frigate
        expect(board.shoot([0, 1])).toEqual({
          result: HIT,
          sink: false,
          ship: frigate,
        }); //frigate
        expect(board.shoot([0, 2])).toEqual({
          result: HIT,
          sink: true,
          ship: frigate,
        }); //frigate
        expect(board.shoot([9, 0])).toEqual({
          result: HIT,
          sink: false,
          ship: galleon,
        }); //galleon
        expect(board.shoot([9, 1])).toEqual({
          result: HIT,
          sink: false,
          ship: galleon,
        }); //galleon
        expect(board.shoot([9, 2])).toEqual({
          result: HIT,
          sink: false,
          ship: galleon,
        }); //galleon
        expect(board.shoot([9, 3])).toEqual({
          result: HIT,
          sink: true,
          ship: galleon,
        }); //galleon

        expect(board.toString()).toBe(['[ X ~ - - - - - - ~ X ]',
                                            '[ X ~ - - - - - - ~ X ]',
                                            '[ X ~ - - - - - - ~ X ]',
                                            '[ ~ ~ - - - - - - ~ X ]',
                                            '[ - - - - - - - - ~ ~ ]',
                                            '[ - - - - - - - - - - ]',
                                            '[ - - - - - - - - - - ]',
                                            '[ - - - - - - - - - - ]',
                                            '[ ~ ~ ~ - - - - - ~ ~ ]',
                                            '[ X X ~ - - - - - ~ X ]',
                                          ].join('\n'));
      });
    });

    // '-' UNREVEALED
    // 'X' HIT
    // '~' WATER
    it('can be casted to a string', () => {
      expect(board.toString()).toEqual(
        ((new Array(10)).fill('[ - - - - - - - - - - ]')).join('\n')
      );
    });

    describe('can be used to place a ship and it', () => {
      let ships;
      let SHIP_TYPES;

      beforeEach(() => {
        SHIP_TYPES = Ship.types();
        ships = [
          new Ship(SHIP_TYPES[0]),
          new Ship(SHIP_TYPES[0]),
        ];
        board.launch([2, 3], ships[0]);
      });

      it('can sink it down instantly and mark fields around it', () => {
        expect(board.sinkShip(ships[0])).toBe(true);
        expect(board.state()[3][2]).toBe(HIT);
        expect(board.state()[2][2]).toBe(WATER); //above
        expect(board.state()[4][2]).toBe(WATER); //below
        expect(board.state()[3][1]).toBe(WATER); //left
        expect(board.state()[3][3]).toBe(WATER); //right
        expect(ships[0].state()).toBe(SUNKEN);
      });

      it('cannot sink down a ship which is not on the it', () => {
        expect(board.sinkShip(ships[1])).toBe(false);
      });

      it('can add an another ship', () => {
        expect(board.launch([5, 6], ships[1])).toBe(true);
        expect(board.ships().length).toBe(2);
        expect(board.ships()[0].ship).toBe(ships[0]);
        expect(board.ships()[1].ship).toBe(ships[1]);
      });

      /*
          [1, 2]  [2, 2]  [3, 2]
          [1, 3] {[2, 3]} [3, 3] // {ship}
          [1, 4]  [2, 4]  [3, 4]
       */
      it('cannot add an another (HORIZONTAL) ship in forbidden location', () => {
        expect(board.launch([10, 10], ships[1])).toBe(false);

        //Row above
        expect(board.launch([1, 2], ships[1])).toBe(false);
        expect(board.launch([2, 2], ships[1])).toBe(false);
        expect(board.launch([3, 2], ships[1])).toBe(false);

        //The same row
        expect(board.launch([1, 3], ships[1])).toBe(false);
        expect(board.launch([2, 3], ships[1])).toBe(false);
        expect(board.launch([3, 3], ships[1])).toBe(false);

        //Row below
        expect(board.launch([1, 4], ships[1])).toBe(false);
        expect(board.launch([2, 4], ships[1])).toBe(false);
        expect(board.launch([3, 4], ships[1])).toBe(false);

        expect(board.ships().length).toBe(1);
      });

      /*
          [1, 2]  [2, 2]  [3, 2]
          [1, 3] {[2, 3]} [3, 3] // {ship}
          [1, 4]  [2, 4]  [3, 4]
       */
      it('cannot add an another (VERTICAL) ship in forbidden location', () => {
        let ship = new Ship(SHIP_TYPES[0]);
        ship.rotate();

        //Row above
        expect(board.launch([1, 2], ship)).toBe(false);
        expect(board.launch([2, 2], ship)).toBe(false);
        expect(board.launch([3, 2], ship)).toBe(false);

        //The same row
        expect(board.launch([1, 3], ship)).toBe(false);
        expect(board.launch([2, 3], ship)).toBe(false);
        expect(board.launch([3, 3], ship)).toBe(false);

        //Row below
        expect(board.launch([1, 4], ship)).toBe(false);
        expect(board.launch([2, 4], ship)).toBe(false);
        expect(board.launch([3, 4], ship)).toBe(false);

        expect(board.ships().length).toBe(1);
      });

      it('can perform a shoot and return outcome of the try if the shoot was missed', () => {
        expect(board.shoot([5, 6])).toEqual({
          result: WATER,
          ship: undefined,
          sink: false,
        });
      });

      it('can perform couple shoots (hit and water) and save them in the local history', () => {
        expect(board.shoot([5, 6])).toEqual({
          result: WATER,
          ship: undefined,
          sink: false,
        });
        expect(board.shoot([7, 8])).toEqual({
          result: WATER,
          ship: undefined,
          sink: false,
        });
        expect(board.shoot([2, 3])).toEqual({
          result: HIT,
          ship: ships[0],
          sink: true,
        });
        expect(board.shoot([5, 5])).toEqual({
          result: WATER,
          ship: undefined,
          sink: false,
        });
        expect(board.history()).toEqual([
          {
            result: WATER,
            target: [5, 6],
            ship: undefined,
            sink: false,
          }, {
            result: WATER,
            target: [7, 8],
            ship: undefined,
            sink: false,
          }, {
            result: HIT,
            target: [2, 3],
            ship: ships[0],
            sink: true,
          }, {
            result: WATER,
            target: [5, 5],
            ship: undefined,
            sink: false,
          },
        ]);
      });

      it('can place another ship, perform 3 hits, sink both ships and print pretty state', () => {
        let brig = new Ship(SHIP_TYPES[1]);
        brig.rotate();

        expect(board.launch([6, 6], brig)).toBe(true);
        expect(board.shoot([2, 3])).toEqual({
          result: HIT,
          ship: ships[0],
          sink: true,
        });
        expect(board.shoot([6, 6])).toEqual({
          result: HIT,
          ship: brig,
          sink: false,
        });
        expect(board.shoot([6, 7])).toEqual({
          result: HIT,
          ship: brig,
          sink: true,
        });
        expect(ships[0].state()).toBe(SUNKEN);
        expect(brig.state()).toBe(SUNKEN);

        expect(board.toString()).toBe(['[ - - - - - - - - - - ]',
                                        '[ - - - - - - - - - - ]',
                                        '[ - ~ ~ ~ - - - - - - ]',
                                        '[ - ~ X ~ - - - - - - ]',
                                        '[ - ~ ~ ~ - - - - - - ]',
                                        '[ - - - - - ~ ~ ~ - - ]',
                                        '[ - - - - - ~ X ~ - - ]',
                                        '[ - - - - - ~ X ~ - - ]',
                                        '[ - - - - - ~ ~ ~ - - ]',
                                        '[ - - - - - - - - - - ]',
                                      ].join('\n'));
      });

      it('can place another 3 ships, sink all of them, and print pretty state', () => {
        let brig = new Ship(SHIP_TYPES[1]);
        brig.rotate();
        let frigate = new Ship(SHIP_TYPES[2]);
        let galleon = new Ship(SHIP_TYPES[3]);
        galleon.rotate();

        expect(board.launch([6, 6], brig)).toBe(true);
        expect(board.launch([0, 8], frigate)).toBe(true);
        expect(board.launch([0, 0], galleon)).toBe(true);

        board.sinkShip(ships[0]);
        board.sinkShip(brig);
        board.sinkShip(frigate);
        board.sinkShip(galleon);

        expect(board.toString()).toBe(['[ X ~ - - - - - - - - ]',
                                        '[ X ~ - - - - - - - - ]',
                                        '[ X ~ ~ ~ - - - - - - ]',
                                        '[ X ~ X ~ - - - - - - ]',
                                        '[ ~ ~ ~ ~ - - - - - - ]',
                                        '[ - - - - - ~ ~ ~ - - ]',
                                        '[ - - - - - ~ X ~ - - ]',
                                        '[ ~ ~ ~ ~ - ~ X ~ - - ]',
                                        '[ X X X ~ - ~ ~ ~ - - ]',
                                        '[ ~ ~ ~ ~ - - - - - - ]',
                                      ].join('\n'));
      });
    });
  });
});
