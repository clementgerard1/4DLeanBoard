import Model from '../Model.class.js';
import Utils from '../Utils.class.js';
import Milestone from '../Milestone.class.js';
import Phase from '../Phase.class.js';
import Task from '../Task.class.js';
import Operation from '../Operation.class.js';
import Object4D from '../Object4D.class.js';
import Object3D from '../Object3D.class.js';
import Contractor from '../Contractor.class.js';
import TaskTeam from '../TaskTeam.class.js';
import OperationUnit from '../OperationUnit.class.js';
import Zone from '../Zone.class.js';
import State from '../State.class.js';
import Delivrable from '../Delivrable.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Model constructor()', () =>{
	const model = new Model();
	expect(model.getId()).toBe(0);
	expect(model.getName()).toBe("");
});

test('Model constructor(name)', () =>{
	const model = new Model("hello");
	expect(model.getId()).toBe(0);
	expect(model.getName()).toBe("hello");
});

test('Model constructor(id, name)', () =>{
	const model = new Model("hello", 15);
	expect(model.getId()).toBe(15);
	expect(model.getName()).toBe("hello");
});

test('addMilestone()', () => {
	const model = new Model();
	model.addMilestone();
  expect(model.getMilestone(0) instanceof Milestone).toBe(true);
});

test('addMilestone(milestone)', () => {
	const model = new Model();
	const milestone = new Milestone();
	model.addMilestone(milestone);
  expect(model.getMilestone(0) instanceof Milestone).toBe(true);
});

test('addMilestone(milestone, n)', () => {
	const model = new Model();
	const milestone = new Milestone();
	Array(6).fill().map(() => model.addMilestone());
	model.addMilestone(milestone, 2);
  expect(model.getMilestone(2) === milestone).toBe(true);
});

test('getMilestones()', () => {
	const model = new Model();
	Array(10).fill().map(() => model.addMilestone());
  expect(model.getMilestones().length).toBe(10);
});

test('removeMilestone(milestone)', () => {
	const model = new Model();
	const milestone = new Milestone();
	model.addMilestone(milestone);
	model.removeMilestone(milestone)
  expect(model.getMilestones().length).toBe(0);
});

test('setLastModifiedDate()', () => {
	const model = new Model();
	const date = new Date();
	model.setLastModifiedDate(date);
  expect(model.getLastModifiedDate() === date).toBe(true);
});

test('setStartDate()', () => {
	const model = new Model();
	const date = new Date(new Date().setDate(new Date().getDate()-1));
	model.setStartDate(date);
  	expect(model.getStartDate() === date).toBe(true);
});

test('getContractors()', () => {
	const model = new Model();
	const milestone = new Milestone();
	model.addMilestone(milestone);
	const phase = new Phase();
	const phase2 = new Phase();
	milestone.addPhase(phase);
	milestone.addPhase(phase2);

	const contractor = new Contractor();
	phase.setContractor(contractor);
	const contractor2 = new Contractor();
	phase2.setContractor(contractor2);
  expect(model.getContractors().length).toBe(2);
});

test('getTaskTeams()', () => {
	const model = new Model();
	const milestone = new Milestone();
	model.addMilestone(milestone);
	const phase = new Phase();
	const phase2 = new Phase();
	milestone.addPhase(phase);
	milestone.addPhase(phase2);
	const task = new Task();
	const taskTeam = new TaskTeam();
	task.setTaskTeam(taskTeam);
	phase.addTask(task);
  expect(model.getTaskTeams().length).toBe(1);
});

test('getOperationUnits()', () => {
	const model = new Model();
	const milestone = new Milestone();
	model.addMilestone(milestone);
	const phase = new Phase();
	const phase2 = new Phase();
	milestone.addPhase(phase);
	milestone.addPhase(phase2);
	const task = new Task();
	phase.addTask(task);
	const operation = new Operation();
	task.addOperation(operation);

	const operationUnit = new OperationUnit();
	operation.setOperationUnit(operationUnit);

  expect(model.getOperationUnits().length).toBe(1);
});

test('getPhases()', () => {
	const model = new Model();
	const milestone = new Milestone();
	const milestone2 = new Milestone();
	const phase = new Phase();
	const phase2 = new Phase();
	model.addMilestone(milestone);
	model.addMilestone(milestone2);
	milestone.addPhase(phase);
	milestone2.addPhase(phase2);
	expect(model.getPhases()).toStrictEqual([phase, phase2]);
});

test('get3DObjectById(id)', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const obj4D = new Object4D();
	const obj3D = new Object3D();
	obj4D.addObject3D(obj3D);
	phase.addObject4D(obj4D);
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	expect(model.get3DObjectById(obj3D.getId())).toStrictEqual(obj3D);
});

test('getContractorById(id)', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const contractor = new Contractor("test", 0);
	phase.setContractor(contractor);
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	expect(model.getContractorById(0)).toStrictEqual(contractor);
});

test('getTasks()', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const task = new Task();
	phase.addTask(task);
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	expect(model.getTasks().length).toStrictEqual(1);
});

test('getOperations()', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const task = new Task();
	const operation = new Operation();
	task.addOperation(operation);
	phase.addTask(task);
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	expect(model.getTasks().length).toStrictEqual(1);
});

test('getProperties()', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const task = new Task();
	const operation = new Operation();
	task.addOperation(operation);
	phase.addTask(task);
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	task.setZone(new Zone());
	task.setState(new State());
	expect(model.getProperties().length).toStrictEqual(2);
});

test('getDelivrables()', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const delivrable = new Delivrable();
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	phase.addDelivrable(delivrable);
	expect(model.getDelivrables().length).toStrictEqual(1);
});

test('getObjects4D()', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const task = new Task();
	const object4D = new Object4D();
	task.setObject4D(object4D);
	phase.addTask(task);
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	expect(model.getObjects4D().length).toStrictEqual(1);
});

test('getObjects3D()', () => {
	const model = new Model();
	const milestone = new Milestone();
	const phase = new Phase();
	const task = new Task();
	const object4D = new Object4D();
	const object3D = new Object3D();
	object4D.addObject3D(object3D);
	task.setObject4D(object4D);
	phase.addTask(task);
	model.addMilestone(milestone);
	milestone.addPhase(phase);
	expect(model.getObjects3D().length).toStrictEqual(1);
});
