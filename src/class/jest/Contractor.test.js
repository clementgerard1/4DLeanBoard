import Contractor from '../Contractor.class.js';
import TaskTeam from '../TaskTeam.class.js';
import Utils from '../Utils.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Contractor constructor()', () =>{
	const contractor = new Contractor();
	expect(contractor.getId()).toBe(0);
	expect(contractor.getName()).toBe("");
});

test('Contractor constructor(name)', () =>{
	const contractor = new Contractor("hello");
	expect(contractor.getId()).toBe(0);
	expect(contractor.getName()).toBe("hello");
});

test('Contractor constructor(id, name)', () =>{
	const contractor = new Contractor("hello", 15);
	expect(contractor.getId()).toBe(15);
	expect(contractor.getName()).toBe("hello");
});

test('addTaskTeam()', () => {
	const contractor = new Contractor();
	contractor.addTaskTeam();
  expect(Object.keys(contractor.getTaskTeams()).length).toBe(1);
});

test('addTaskTeam(taskTeam)', () => {
	const contractor = new Contractor();
	const taskTeam = new TaskTeam();
	contractor.addTaskTeam(taskTeam);
  expect(contractor.getTaskTeam(taskTeam.getId()) instanceof TaskTeam).toBe(true);
});

test('getTaskTeams()', () => {
	const contractor = new Contractor();
	Array(10).fill().map(() => contractor.addTaskTeam());
  expect(Object.keys(contractor.getTaskTeams()).length).toBe(10);
});

test('getTaskTeam(id)', () => {
	const contractor = new Contractor();
	const taskTeam = new TaskTeam();
	contractor.addTaskTeam(taskTeam);
  expect(contractor.getTaskTeam(taskTeam.getId()) == taskTeam).toBe(true);
});

test('removeTaskTeam(taskTeam)', () => {
	const contractor = new Contractor();
	const taskTeam = new TaskTeam();
	contractor.addTaskTeam(taskTeam);
	contractor.removeTaskTeam(taskTeam);
  expect(Object.keys(contractor.getTaskTeams()).length).toBe(0);
});