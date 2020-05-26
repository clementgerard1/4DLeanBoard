import State from '../State.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('State constructor()', () =>{
	const state = new State();
	expect(state.getId()).toBe(0);
	expect(state.getName()).toBe("");
	expect(state.getValue()).toBe("");
});

test('State constructor(value)', () =>{
	const state = new State("hello");
	expect(state.getId()).toBe(0);
	expect(state.getName()).toBe("");
	expect(state.getValue()).toBe("hello");
});

test('State constructor(value, name)', () =>{
	const state = new State("hello", "bonjour");
	expect(state.getId()).toBe(0);
	expect(state.getName()).toBe("bonjour");
	expect(state.getValue()).toBe("hello");
});

test('State constructor(value, name, id)', () =>{
	const state = new State("hello", "bonjour", 10);
	expect(state.getId()).toBe(10);
	expect(state.getName()).toBe("bonjour");
	expect(state.getValue()).toBe("hello");
});