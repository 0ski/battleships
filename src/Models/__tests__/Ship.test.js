import Ship from '../Ship';

describe('Ship', () => {
  let types;

  beforeEach(() => {
    types = Ship.types();
    shapes = Ship.shapes(); //First version is going to have just orientation mapping
  });

  describe('class', () => {
    it('can return available ship types mapping name=>size', () => {
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      let type = types[0];
      expect(type.name).toBe('string');
      expect(type.size).toBe('number');
    });

    it('can return available ship shapes mapping ENUMs', () => {
      expect(shapes).not.toBe(undefined);
    });

    it('constructs an instance correctly', () => {
      let ship = new Ship();
      expect(ship).not.toBe(undefined);
    });
  });

  describe('instance', () => {
    let ship;
    let type;

    beforeEach(() => {
      type = types[0];
      ship = new Ship(type);
    });

    it('has a proper name, shape and size', () => {
      expect(ship.name()).toBe(type.name);
      expect(ship.shape()).toBe(shapes.VERTICAL);
      expect(ship.size()).toBe(type.size);
    });

    it('can change its orientation', () => {
      ship.shape(shapes.HORIZONTAL);
      expect(ship.shape()).toBe(shapes.HORIZONTAL);
      ship.rotate();
      expect(ship.shape()).toBe(shapes.VERTICAL);
    });
  });

});
