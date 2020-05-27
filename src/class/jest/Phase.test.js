import Utils from '../Utils.class.js';
import Phase from '../Phase.class.js';
import Task from '../Task.class.js';
import Delivrable from '../Delivrable.class.js';
import Object4D from '../Object4D.class.js';
import Contractor from '../Contractor.class.js';
import TaskTeam from '../TaskTeam.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Phase constructor()', () =>{
	const phase = new Phase();
	expect(phase.getId()).toBe(0);
	expect(phase.getName()).toBe("");
});

test('Phase constructor(name)', () =>{
	const phase = new Phase("hello");
	expect(phase.getId()).toBe(0);
	expect(phase.getName()).toBe("hello");
});

test('Phase constructor(id, name)', () =>{
	const phase = new Phase("hello", 15);
	expect(phase.getId()).toBe(15);
	expect(phase.getName()).toBe("hello");
});

test('addTask()', () => {
	const phase = new Phase();
	phase.addTask();
  expect(Object.keys(phase.getTasks()).length).toBe(1);
});

test('addTask(task)', () => {
	const phase = new Phase();
	const task = new Task();
	phase.addTask(task);
  expect(phase.getTask(task.id) instanceof Task).toBe(true);
});

test('getTasks()', () => {
	const phase = new Phase();
	Array(10).fill().map(() => phase.addTask());
  expect(Object.keys(phase.getTasks()).length).toBe(10);
});

test('getTask(id)', () => {
	const phase = new Phase();
	const task = new Task();
	phase.addTask(task);
  expect(phase.getTask(task.id) == task).toBe(true);
});

test('removeTask(task)', () => {
	const phase = new Phase();
	const task = new Task();
	phase.addTask(task);
	phase.removeTask(task);
  expect(Object.keys(phase.getTasks()).length).toBe(0);
});

test('addObject4D()', () => {
	const phase = new Phase();
	phase.addObject4D();
  expect(Object.keys(phase.getObjects4D()).length).toBe(1);
});

test('addObject4D(object4D)', () => {
	const phase = new Phase();
	const object4D = new Object4D();
	phase.addObject4D(object4D);
  expect(phase.getObject4D(object4D.id) instanceof Object4D).toBe(true);
});

test('getObjects4D()', () => {
	const phase = new Phase();
	Array(10).fill().map(() => phase.addObject4D());
  expect(Object.keys(phase.getObjects4D()).length).toBe(10);
});

test('getObject4D(id)', () => {
	const phase = new Phase();
	const object4D = new Object4D();
	phase.addObject4D(object4D);
  expect(phase.getObject4D(object4D.id) == object4D).toBe(true);
});

test('removeObject4D(object4D)', () => {
	const phase = new Phase();
	const object4D = new Object4D();
	phase.addObject4D(object4D);
	phase.removeObject4D(object4D);
  expect(Object.keys(phase.getObjects4D()).length).toBe(0);
});

test('addDelivrable()', () => {
	const phase = new Phase();
	phase.addDelivrable();
  expect(Object.keys(phase.getDelivrables()).length).toBe(1);
});

test('addDelivrable(delivrable)', () => {
	const phase = new Phase();
	const delivrable = new Delivrable();
	phase.addDelivrable(delivrable);
  expect(phase.getDelivrable(delivrable.id) instanceof Delivrable).toBe(true);
});

test('getDelivrables()', () => {
	const phase = new Phase();
	Array(10).fill().map(() => phase.addDelivrable());
  expect(Object.keys(phase.getDelivrables()).length).toBe(10);
});

test('getDelivrable(id)', () => {
	const phase = new Phase();
	const delivrable = new Delivrable();
	phase.addDelivrable(delivrable);
  expect(phase.getDelivrable(delivrable.id) == delivrable).toBe(true);
});

test('removeDelivrable(delivrable)', () => {
	const phase = new Phase();
	const delivrable = new Delivrable();
	phase.addDelivrable(delivrable);
	phase.removeDelivrable(delivrable);
  expect(Object.keys(phase.getDelivrables()).length).toBe(0);
});

test('setContractor(contractor', () => {
	const phase = new Phase();
	const contractor = new Contractor();
	phase.setContractor(contractor);
	expect(phase.getContractor()).toBe(contractor);
});

test('addFollowingPhase(phase)', () => {
	const phase = new Phase();
	const phase2 = new Phase();
	phase.addFollowingPhase(phase2);
  expect(Object.keys(phase.getFollowingPhases()).length).toBe(1);
});

test('removeFollowingPhase(phase)', () => {
	const phase = new Phase();
	const phase2 = new Phase();
	phase.addFollowingPhase(phase2);
	phase.removeFollowingPhase(phase2);
  expect(Object.keys(phase.getFollowingPhases()).length).toBe(0);
});

test('getTaskTeams()', () => {
	const phase = new Phase();
	const task = new Task();
	const task2 = new Task();
	const taskTeam = new TaskTeam();
	const taskTeam2 = new TaskTeam();
	const taskTeam3 = new TaskTeam();
	phase.addTask(task);
	task.setTaskTeam(taskTeam);
	phase.addTask(task2);
	task2.setTaskTeam(taskTeam3);
	task2.setTaskTeam(taskTeam2);
	task.setTaskTeam(taskTeam3);
  expect(phase.getTaskTeams().length).toBe(2);
});

