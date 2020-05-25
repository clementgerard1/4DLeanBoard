import Level from '../Level.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Level constructor()', () =>{
	const level = new Level();
	expect(level.getId()).toBe(0);
	expect(level.getName()).toBe("");
	expect(level.getValue()).toBe("");
});

test('Level constructor(value)', () =>{
	const level = new Level("hello");
	expect(level.getId()).toBe(0);
	expect(level.getName()).toBe("");
	expect(level.getValue()).toBe("hello");
});

test('Level constructor(value, name)', () =>{
	const level = new Level("hello", "bonjour");
	expect(level.getId()).toBe(0);
	expect(level.getName()).toBe("bonjour");
	expect(level.getValue()).toBe("hello");
});

test('Level constructor(value, name, id)', () =>{
	const level = new Level("hello", "bonjour", 10);
	expect(level.getId()).toBe(10);
	expect(level.getName()).toBe("bonjour");
	expect(level.getValue()).toBe("hello");
});