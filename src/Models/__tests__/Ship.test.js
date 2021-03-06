import Ship from '../Ship';

const { SUNKEN, GARAGE, FLOATING } = Ship.states();

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

    it('can return possible states of ships', () => {
      expect(SUNKEN).toBeDefined();
      expect(GARAGE).toBeDefined();
      expect(FLOATING).toBeDefined();
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
      type = types[1];
      ship = new Ship(type);
    });

    it('has a proper name type, shape, size and state', () => {
      expect(ship.name()).toBe(type.name);
      expect(ship.shape()).toBe(shapes.HORIZONTAL);
      expect(ship.size()).toBe(type.size);
      expect(ship.state()).toBe(GARAGE);
    });

    it('can change its orientation', () => {
      ship.shape(shapes.VERTICAL);
      expect(ship.shape()).toBe(shapes.VERTICAL);
      ship.rotate();
      expect(ship.shape()).toBe(shapes.HORIZONTAL);
    });

    it('can be launched', () => {
      ship.launch();
      expect(ship.state()).toBe(FLOATING);
    });

    it('has initial value of hitpoints equals to its size', () => {
      expect(ship.hitpoints()).toBe(ship.size());
    });

    it('can be hit and lose hitpoint if so', () => {
      expect(ship.hit()).toBe(ship.size() - 1);
      expect(ship.hitpoints()).toBe(ship.size() - 1);
    });

    it('can be hit till it goes down', () => {
      expect(ship.hit()).toBe(ship.size() - 1);
      expect(ship.hit()).toBe(0);
      expect(ship.state()).toBe(SUNKEN);
    });

    it('can be sunken instantly', () => {
      ship.sink();
      expect(ship.state()).toBe(SUNKEN);
      expect(ship.hitpoints()).toBe(0);
    });
  });

});
