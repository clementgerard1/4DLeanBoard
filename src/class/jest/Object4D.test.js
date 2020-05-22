import Object4D from '../Object4D.class.js';
import Object3D from '../Object3D.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Object4D constructor()', () =>{
	const object4D = new Object4D();
	expect(object4D.getId()).toBe(0);
	expect(object4D.getName()).toBe("");
});

test('Object4D constructor(name)', () =>{
	const object4D = new Object4D("hello");
	expect(object4D.getId()).toBe(0);
	expect(object4D.getName()).toBe("hello");
});

test('Object4D constructor(id, name)', () =>{
	const object4D = new Object4D("hello", 15);
	expect(object4D.getId()).toBe(15);
	expect(object4D.getName()).toBe("hello");
});

test('addObject3D()', () => {
	const object4D = new Object4D();
	object4D.addObject3D();
  expect(Object.keys(object4D.getObjects3D()).length).toBe(1);
});

test('addObject3D(object3D)', () => {
	const object4D = new Object4D();
	const object3D = new Object3D();
	object4D.addObject3D(object3D);
  expect(object4D.getObject3D(object3D.id) instanceof Object3D).toBe(true);
});

test('getObjects3D()', () => {
	const object4D = new Object4D();
	Array(10).fill().map(() => object4D.addObject3D());
  expect(Object.keys(object4D.getObjects3D()).length).toBe(10);
});

test('getObject3D(id)', () => {
	const object4D = new Object4D();
	const object3D = new Object3D();
	object4D.addObject3D(object3D);
  expect(object4D.getObject3D(object3D.id) == object3D).toBe(true);
});
