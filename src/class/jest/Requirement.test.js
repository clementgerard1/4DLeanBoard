import Requirement from '../Requirement.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Requirement constructor()', () =>{
	const requirement = new Requirement();
	expect(requirement.getId()).toBe(0);
	expect(requirement.getName()).toBe("");
});

test('Requirement constructor(name)', () =>{
	const requirement = new Requirement("hello");
	expect(requirement.getId()).toBe(0);
	expect(requirement.getName()).toBe("hello");
});

test('Requirement constructor(id, name)', () =>{
	const requirement = new Requirement("hello", 15);
	expect(requirement.getId()).toBe(15);
	expect(requirement.getName()).toBe("hello");
});

test('setValue(bool)', () => {
	const requirement = new Requirement("hello");
	expect(requirement.getValue()).toBe(false);
	requirement.setValue(true);
	expect(requirement.getValue()).toBe(true);
});