import Task from '../Task.class.js';
import Operation from '../Operation.class.js';
import Object4D from '../Object4D.class.js';
import Utils from '../Utils.class.js';
import Property from '../interfaces/Property.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Task constructor()', () =>{
	const task = new Task();
	expect(task.getId()).toBe(0);
	expect(task.getName()).toBe("");
});

test('Task constructor(name)', () =>{
	const task = new Task("hello");
	expect(task.getId()).toBe(0);
	expect(task.getName()).toBe("hello");
});

test('Task constructor(id, name)', () =>{
	const task = new Task("hello", 15);
	expect(task.getId()).toBe(15);
	expect(task.getName()).toBe("hello");
});

test('setName(name)', () =>{
	const task = new Task("hello", 15);
	task.setName("bonjour");
	expect(task.getName()).toBe("bonjour");
});

test('setName(null)', () =>{
	const task = new Task("hello", 15);
	task.setName(null);
	expect(task.getName()).toBe("hello");
});

test('addFollowingTask(task)', () => {
	const task = new Task();
	const task2 = new Task();
	task.addFollowingTask(task2);
  expect(Object.keys(task.getFollowingTasks()).length).toBe(1);
});

test('removeFollowingTask(task)', () => {
	const task = new Task();
	const task2 = new Task();
	task.addFollowingTask(task2);
	task.removeFollowingTask(task2);
  expect(Object.keys(task.getFollowingTasks()).length).toBe(0);
});

test('addOperation()', () => {
	const task = new Task();
	task.addOperation();
  expect(Object.keys(task.getOperations()).length).toBe(1);
});

test('addOperation(operation)', () => {
	const task = new Task();
	const operation = new Operation();
	task.addOperation(operation);
  expect(task.getOperation(operation.id) instanceof Operation).toBe(true);
});

test('getOperations()', () => {
	const task = new Task();
	Array(10).fill().map(() => task.addOperation());
  expect(Object.keys(task.getOperations()).length).toBe(10);
});

test('getOperation(id)', () => {
	const task = new Task();
	const operation = new Operation();
	task.addOperation(operation);
  expect(task.getOperation(operation.id) == operation).toBe(true);
});

test('setObject4D(object4D', () => {
	const task = new Task();
	const object4D = new Object4D();
	task.setObject4D(object4D);
	expect(task.getObject4D()).toBe(object4D);
});

test('addProperty()', () => {
	const task = new Task();
	task.addProperty();
  expect(Object.keys(task.getProperties()).length).toBe(1);
});

test('addProperty(property)', () => {
	const task = new Task();
	const property = new Property();
	task.addProperty(property);
  expect(task.getProperty(property.id) instanceof Property).toBe(true);
});

test('getProperties()', () => {
	const task = new Task();
	Array(10).fill().map(() => task.addProperty());
  expect(Object.keys(task.getProperties()).length).toBe(10);
});

test('removeProperty(property)', () => {
	const task = new Task();
	const property = new Property();
	task.addProperty(property);
	task.removeProperty(property);
  expect(Object.keys(task.getProperties()).length).toBe(0);
});