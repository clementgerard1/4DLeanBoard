import OperationUnit from '../OperationUnit.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('OperationUnit constructor()', () =>{
	const operationUnit = new OperationUnit();
	expect(operationUnit.getId()).toBe(0);
	expect(operationUnit.getName()).toBe("");
});

test('OperationUnit constructor(name)', () =>{
	const operationUnit = new OperationUnit("hello");
	expect(operationUnit.getId()).toBe(0);
	expect(operationUnit.getName()).toBe("hello");
});

test('OperationUnit constructor(id, name)', () =>{
	const operationUnit = new OperationUnit("hello", 15);
	expect(operationUnit.getId()).toBe(15);
	expect(operationUnit.getName()).toBe("hello");
});