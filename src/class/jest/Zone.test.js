import Zone from '../Zone.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Zone constructor()', () =>{
	const zone = new Zone();
	expect(zone.getId()).toBe(0);
	expect(zone.getName()).toBe("");
	expect(zone.getValue()).toBe("");
});

test('Zone constructor(value)', () =>{
	const zone = new Zone("hello");
	expect(zone.getId()).toBe(0);
	expect(zone.getName()).toBe("");
	expect(zone.getValue()).toBe("hello");
});

test('Zone constructor(value, name)', () =>{
	const zone = new Zone("hello", "bonjour");
	expect(zone.getId()).toBe(0);
	expect(zone.getName()).toBe("bonjour");
	expect(zone.getValue()).toBe("hello");
});

test('Zone constructor(value, name, id)', () =>{
	const zone = new Zone("hello", "bonjour", 10);
	expect(zone.getId()).toBe(10);
	expect(zone.getName()).toBe("bonjour");
	expect(zone.getValue()).toBe("hello");
});