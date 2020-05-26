import ConstructionType from '../ConstructionType.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('ConstructionType constructor()', () =>{
	const constructionType = new ConstructionType();
	expect(constructionType.getId()).toBe(0);
	expect(constructionType.getName()).toBe("");
	expect(constructionType.getValue()).toBe("");
});

test('ConstructionType constructor(value)', () =>{
	const constructionType = new ConstructionType("hello");
	expect(constructionType.getId()).toBe(0);
	expect(constructionType.getName()).toBe("");
	expect(constructionType.getValue()).toBe("hello");
});

test('ConstructionType constructor(value, name)', () =>{
	const constructionType = new ConstructionType("hello", "bonjour");
	expect(constructionType.getId()).toBe(0);
	expect(constructionType.getName()).toBe("bonjour");
	expect(constructionType.getValue()).toBe("hello");
});

test('ConstructionType constructor(value, name, id)', () =>{
	const constructionType = new ConstructionType("hello", "bonjour", 10);
	expect(constructionType.getId()).toBe(10);
	expect(constructionType.getName()).toBe("bonjour");
	expect(constructionType.getValue()).toBe("hello");
});