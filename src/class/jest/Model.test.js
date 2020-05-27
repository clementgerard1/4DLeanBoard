import Model from '../Model.class.js';
import Utils from '../Utils.class.js';
import Milestone from '../Milestone.class.js';
import Phase from '../Phase.class.js';
import Contractor from '../Contractor.class.js';

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
