import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Utils getId()', () => {
	const firstId = Utils.getId();
  expect(firstId).toBe(0);
});

test('Utils getId() 10*', () => {
	Array(10).fill().map(() => Utils.getId());
	const id = Utils.getId();
  expect(id).toBe(10);
});

test('Utils getId("test")', () => {
	const firstId = Utils.getId("test");
  expect(firstId).toBe(0);
});

test('Utils getId("test") 10*', () => {
	Array(10).fill().map(() => Utils.getId("test"));
	const id = Utils.getId("test");
  expect(id).toBe(10);
});

test('Utils getId("test1"|"test2")', () => {
	const firstId = Utils.getId("test1");
	const firstId2 = Utils.getId("test2");
  expect(firstId).toBe(0);
});

test('Utils getId("test1"|"test2"|"default") 10*', () => {
	Array(10).fill().map(() => Utils.getId("test1"));
	const id1 = Utils.getId("test1");
	Array(10).fill().map(() => Utils.getId());
	const id2 = Utils.getId();
	Array(10).fill().map(() => Utils.getId("test2"));
	const id3 = Utils.getId("test2");
  expect(id1).toBe(10);
  expect(id2).toBe(10);
  expect(id3).toBe(10);
});