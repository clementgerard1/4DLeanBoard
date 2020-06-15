import Object3D from '../Object3D.class.js';
import Object4D from '../Object4D.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Object3D constructor()', () =>{
	const object3D = new Object3D();
	expect(object3D.getId()).toBe(0);
	expect(object3D.getUniqId()).toBe("");
	expect(object3D.getName()).toBe("");
});

test('Object3D constructor(name)', () =>{
	const object3D = new Object3D("hello");
	expect(object3D.getId()).toBe(0);
	expect(object3D.getUniqId()).toBe("");
	expect(object3D.getName()).toBe("hello");
});

test('Object3D constructor(id, objId)', () =>{
	const object3D = new Object3D("hello", 10);
	expect(object3D.getId()).toBe(0);
	expect(object3D.getUniqId()).toBe(10);
	expect(object3D.getName()).toBe("hello");
});


test('Object3D constructor(id, objId, name)', () =>{
	const object3D = new Object3D("hello", 10, 15);
	expect(object3D.getId()).toBe(15);
	expect(object3D.getName()).toBe("hello");
	expect(object3D.getUniqId()).toBe(10);
});

test('setParent(object4D)', () => {
	const object3D = new Object3D("hello");
	const object4D = new Object4D();
	object3D.setParent(object4D);
	expect(object3D.getParent()).toBe(object4D);
});