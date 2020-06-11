import Task from '../Task.class.js';
import TaskTeam from '../TaskTeam.class.js';
import Operation from '../Operation.class.js';
import Phase from '../Phase.class.js';
import Object4D from '../Object4D.class.js';
import Utils from '../Utils.class.js';
import ConstructionType from '../ConstructionType.class.js';
import Zone from '../Zone.class.js';
import State from '../State.class.js';
import Requirement from '../Requirement.class.js';

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

test('addPreviousTask(task)', () => {
	const task = new Task();
	const task2 = new Task();
	task.addPreviousTask(task2);
  expect(Object.keys(task.getPreviousTasks()).length).toBe(1);
});

test('removePreviousTask(task)', () => {
	const task = new Task();
	const task2 = new Task();
	task.addPreviousTask(task2);
	task.removePreviousTask(task2);
  expect(Object.keys(task.getPreviousTasks()).length).toBe(0);
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
  expect(task.getOperation(operation.getId()) instanceof Operation).toBe(true);
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
  expect(task.getOperation(operation.getId()) == operation).toBe(true);
});

test('setObject4D(object4D)', () => {
	const task = new Task();
	const object4D = new Object4D();
	task.setObject4D(object4D);
	expect(task.getObject4D()).toBe(object4D);
});

test('setTaskTeam()', () => {
	const task = new Task();
	const team = new TaskTeam();
	task.setTaskTeam(team);
  expect(task.getTaskTeam()).toBe(team);
});

test('setZone(zone)', () => {
	const task = new Task();
	const zone = new Zone();
	task.setZone(zone);
	expect(task.getZone()).toBe(zone);
});

test('setConstructionType(constructionType)', () => {
	const task = new Task();
	const constructionType = new ConstructionType();
	task.setConstructionType(constructionType);
	expect(task.getConstructionType()).toBe(constructionType);
});

test('setState(state)', () => {
	const task = new Task();
	const state = new State();
	task.setState(state);
	expect(task.getState()).toBe(state);
});

test('getRequirement(name)', () => {
	const task = new Task();
	const requirement = new Requirement("constraint");
	requirement.setValue(true);
	task.addRequirement("constraint", requirement);
	expect(task.getRequirement("constraint").getValue()).toBe(true);
});

test('setParentPhase(phase)', () => {
	const task = new Task();
	const phase = new Phase();
	task.setParentPhase(phase);
	expect(task.getParentPhase()).toBe(phase);
});

test('setStartDate(date)', () => {
	const task = new Task();
	const date = new Date();
	task.setStartDate(date);
	expect(task.getStartDate()).toBe(date);
});

test('setEndDate(date)', () => {
	const task = new Task();
	const date = new Date();
	task.setEndDate(date);
	expect(task.getEndDate()).toBe(date);
});

test('isReady()', () => {
	const task = new Task();
	const req1 = new Requirement("req1");
	req1.setValue(true);
	task.addRequirement("req1", req1);
	expect(task.isReady()).toBe(true);
});