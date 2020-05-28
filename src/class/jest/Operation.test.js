import Utils from '../Utils.class.js';
import Operation from '../Operation.class.js';
import OperationUnit from '../OperationUnit.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Operation constructor()', () =>{
	const operation = new Operation();
	expect(operation.getId()).toBe(0);
	expect(operation.getName()).toBe("");
});

test('Operation constructor(name)', () =>{
	const operation = new Operation("hello");
	expect(operation.getId()).toBe(0);
	expect(operation.getName()).toBe("hello");
});

test('Operation constructor(name, duration)', () =>{
	const operation = new Operation("hello", 10);
	expect(operation.getId()).toBe(0);
	expect(operation.getName()).toBe("hello");
	expect(operation.getDuration()).toBe(10);
});

test('Operation constructor(name, duration, id)', () =>{
	const operation = new Operation("hello", 10, 15);
	expect(operation.getId()).toBe(15);
	expect(operation.getName()).toBe("hello");
});

test('setOperationUnit(operationUnit', () => {
	const operation = new Operation();
	const operationUnit = new OperationUnit();
	operation.setOperationUnit(operationUnit);
	expect(operation.getOperationUnit()).toBe(operationUnit);
});

test('addFollowingOperation(operation)', () => {
	const operation = new Operation();
	const operation2 = new Operation();
	operation.addFollowingOperation(operation2);
  expect(Object.keys(operation.getFollowingOperations()).length).toBe(1);
});

test('removeFollowingOperation(operation)', () => {
	const operation = new Operation();
	const operation2 = new Operation();
	operation.addFollowingOperation(operation2);
	operation.removeFollowingOperation(operation2);
  expect(Object.keys(operation.getFollowingOperations()).length).toBe(0);
});

test('addPreviousOperation(operation)', () => {
	const operation = new Operation();
	const operation2 = new Operation();
	operation.addPreviousOperation(operation2);
  expect(Object.keys(operation.getPreviousOperations()).length).toBe(1);
});

test('removePreviousOperation(operation)', () => {
	const operation = new Operation();
	const operation2 = new Operation();
	operation.addPreviousOperation(operation2);
	operation.removePreviousOperation(operation2);
  expect(Object.keys(operation.getPreviousOperations()).length).toBe(0);
});

test('setStartDate(date)', () => {
	const operation = new Operation();
	const date = new Date();
	operation.setStartDate(date);
	expect(operation.getStartDate()).toBe(date);
});

test('setEndDate(date)', () => {
	const operation = new Operation();
	const date = new Date();
	operation.setEndDate(date);
	expect(operation.getEndDate()).toBe(date);
});