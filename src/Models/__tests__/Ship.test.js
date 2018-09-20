import Ship from '../Ship';

describe('Ship', () => {
  let types;
  let shapes;

  beforeEach(() => {
    types = Ship.types();
    shapes = Ship.shapes(); //First version is going to have just orientation mapping
  });

  describe('class', () => {
    it('can return available ship types array {name, size}', () => {
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      let type = types[0];
      expect(typeof type.name).toBe('string');
      expect(typeof type.size).toBe('number');
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

    it('has a proper name type, shape and size', () => {
      expect(ship.type()).toBe(type.name);
      expect(ship.shape()).toBe(shapes.HORIZONTAL);
      expect(ship.size()).toBe(type.size);
    });

    it('can change its orientation', () => {
      ship.shape(shapes.VERTICAL);
      expect(ship.shape()).toBe(shapes.VERTICAL);
      ship.rotate();
      expect(ship.shape()).toBe(shapes.HORIZONTAL);
    });
  });

});
