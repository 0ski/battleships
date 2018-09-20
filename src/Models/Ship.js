const SHAPES = {
  HORIZONTAL: 0,
  VERTICAL: 1,
};

// http://www.pirateglossary.com/ships/
const TYPES = [
  { name: 'Sloop', size: 1 },
  { name: 'Brigantine', size: 2 },
  { name: 'Frigate', size: 3 },
  { name: 'Galleon', size: 4 },
];

const STATES = {
  SUNKEN: 0,
  GARAGE: 1,
  FLOATING: 2,
};

class Ship {

  static types() {
    return TYPES;
  }

  static shapes() {
    return SHAPES;
  }

  static states() {
    return STATES;
  }

  constructor(type) {
    if (type) {
      this._type = type.name;
      this._size = type.size;
    } else {
      this._type = '';
      this._size = 0;
    }

    this._state = STATES.GARAGE;
    this._shape = SHAPES.HORIZONTAL;
  }

  sink() {
    return this._state = STATES.SUNKEN;
  }

  launch() {
    return this._state = STATES.FLOATING;
  }

  state() {
    return this._state;
  }

  type() {
    return this._type;
  }

  size() {
    return this._size;
  }

  shape(shape) {
    if (shape === undefined) {
      return this._shape;
    } else {
      if (Object.values(SHAPES).indexOf(shape) === -1) {
        return;
      }

      this._shape = shape;
    }

    return this._shape;
  }

  rotate() {
    this._shape = (this._shape + 1) % 2;
  }
}

export default Ship;
