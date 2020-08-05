import TaskTeam from '../TaskTeam.class.js';
import OperationUnit from '../OperationUnit.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('TaskTeam constructor()', () =>{
	const taskTeam = new TaskTeam();
	expect(taskTeam.getId()).toBe(0);
	expect(taskTeam.getName()).toBe("");
});

test('TaskTeam constructor(name)', () =>{
	const taskTeam = new TaskTeam("hello");
	expect(taskTeam.getId()).toBe(0);
	expect(taskTeam.getName()).toBe("hello");
});

test('TaskTeam constructor(name, abr)', () =>{
	const taskTeam = new TaskTeam("hello", "abr");
	expect(taskTeam.getId()).toBe(0);
	expect(taskTeam.getAbr()).toBe("ABR");
	expect(taskTeam.getName()).toBe("hello");
});

test('TaskTeam constructor(name, abr, id)', () =>{
	const taskTeam = new TaskTeam("hello", "abr", 15);
	expect(taskTeam.getAbr()).toBe("ABR");
	expect(taskTeam.getId()).toBe(15);
	expect(taskTeam.getName()).toBe("hello");
});

test('addOperationUnit()', () => {
	const taskTeam = new TaskTeam();
	taskTeam.addOperationUnit();
  expect(Object.keys(taskTeam.getOperationUnits()).length).toBe(1);
});

test('addOperationUnit(operationUnit)', () => {
	const taskTeam = new TaskTeam();
	const operationUnit = new OperationUnit();
	taskTeam.addOperationUnit(operationUnit);
  expect(taskTeam.getOperationUnit(operationUnit.getId()) instanceof OperationUnit).toBe(true);
});

test('getOperationUnits()', () => {
	const taskTeam = new TaskTeam();
	Array(10).fill().map(() => taskTeam.addOperationUnit());
  expect(Object.keys(taskTeam.getOperationUnits()).length).toBe(10);
});

test('getOperationUnit(id)', () => {
	const taskTeam = new TaskTeam();
	const operationUnit = new OperationUnit();
	taskTeam.addOperationUnit(operationUnit);
  expect(taskTeam.getOperationUnit(operationUnit.getId()) == operationUnit).toBe(true);
});

test('removeOperationUnit(operationUnit)', () => {
	const taskTeam = new TaskTeam();
	const operationUnit = new OperationUnit();
	taskTeam.addOperationUnit(operationUnit);
	taskTeam.removeOperationUnit(operationUnit);
  expect(Object.keys(taskTeam.getOperationUnits()).length).toBe(0);
});

test('setWorkers(nb)', () => {
	const taskTeam = new TaskTeam();
	taskTeam.setWorkers(10);
	expect(taskTeam.getWorkers()).toBe(10);
});