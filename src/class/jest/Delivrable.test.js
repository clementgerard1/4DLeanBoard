import Delivrable from '../Delivrable.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Delivrable constructor()', () =>{
	const delivrable = new Delivrable();
	expect(delivrable.getId()).toBe(0);
	expect(delivrable.getName()).toBe("");
});

test('Delivrable constructor(name)', () =>{
	const delivrable = new Delivrable("hello");
	expect(delivrable.getId()).toBe(0);
	expect(delivrable.getName()).toBe("hello");
});

test('Delivrable constructor(id, name)', () =>{
	const delivrable = new Delivrable("hello", 15);
	expect(delivrable.getId()).toBe(15);
	expect(delivrable.getName()).toBe("hello");
});