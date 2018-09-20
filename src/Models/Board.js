const CELL_TYPES = {
  UNREVEALED: 0,
  WATER: 1,
  HIT: 2,
};

class Board {
  static cellTypes() {
    return CELL_TYPES;
  }
}

export default Board;
