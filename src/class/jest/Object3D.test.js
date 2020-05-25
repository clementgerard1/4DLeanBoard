import Object3D from '../Object3D.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Object3D constructor()', () =>{
	const object3D = new Object3D();
	expect(object3D.getId()).toBe(0);
	expect(object3D.getName()).toBe("");
});

test('Object3D constructor(name)', () =>{
	const object3D = new Object3D("hello");
	expect(object3D.getId()).toBe(0);
	expect(object3D.getName()).toBe("hello");
});

test('Object3D constructor(id, name)', () =>{
	const object3D = new Object3D("hello", 15);
	expect(object3D.getId()).toBe(15);
	expect(object3D.getName()).toBe("hello");
});

