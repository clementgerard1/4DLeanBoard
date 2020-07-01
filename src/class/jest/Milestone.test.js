import Milestone from '../Milestone.class.js';
import Requirement from '../Requirement.class.js';
import Utils from '../Utils.class.js';
import Phase from '../Phase.class.js';

beforeEach(() => {
  Utils.ids = {
  	"default" : 0
  };
});

test('Milestone constructor()', () =>{
	const milestone = new Milestone();
	expect(milestone.getId()).toBe(0);
	expect(milestone.getName()).toBe("");
	expect(milestone.isEvent()).toBe(false);
});

test('Milestone constructor()', () =>{
	const milestone = new Milestone("hello");
	expect(milestone.getId()).toBe(0);
	expect(milestone.getName()).toBe("hello");
	expect(milestone.isEvent()).toBe(false);
});

test('Milestone constructor(name, event)', () =>{
	const milestone = new Milestone("hello", true);
	expect(milestone.getId()).toBe(0);
	expect(milestone.isEvent()).toBe(true);
	expect(milestone.getName()).toBe("hello");
});

test('Milestone constructor(name, event, id)', () =>{
	const milestone = new Milestone("hello", true, 15);
	expect(milestone.getId()).toBe(15);
	expect(milestone.getName()).toBe("hello");
	expect(milestone.isEvent()).toBe(true);
});

test('addPhase()', () => {
	const milestone = new Milestone();
	milestone.addPhase();
  expect(Object.keys(milestone.getPhases()).length).toBe(1);
});

test('addPhase(phase)', () => {
	const milestone = new Milestone();
	const phase = new Phase();
	milestone.addPhase(phase);
  expect(milestone.getPhase(phase.getId()) instanceof Phase).toBe(true);
});

test('getPhases()', () => {
	const milestone = new Milestone();
	Array(10).fill().map(() => milestone.addPhase());
  expect(Object.keys(milestone.getPhases()).length).toBe(10);
});

test('removePhase(phase)', () => {
	const milestone = new Milestone();
	const phase = new Phase();
	milestone.addPhase(phase);
	milestone.removePhase(phase);
  expect(Object.keys(milestone.getPhases()).length).toBe(0);
});

test('addFollowingMilestone(milestone)', () => {
	const milestone = new Milestone();
	const milestone2 = new Milestone();
	milestone.addFollowingMilestone(milestone2);
  expect(Object.keys(milestone.getFollowingMilestones()).length).toBe(1);
});

test('removeFollowingMilestone(milestone)', () => {
	const milestone = new Milestone();
	const milestone2 = new Milestone();
	milestone.addFollowingMilestone(milestone2);
	milestone.removeFollowingMilestone(milestone2);
  expect(Object.keys(milestone.getFollowingMilestones()).length).toBe(0);
});

test('addPreviousMilestone(milestone)', () => {
	const milestone = new Milestone();
	const milestone2 = new Milestone();
	milestone.addPreviousMilestone(milestone2);
  expect(Object.keys(milestone.getPreviousMilestones()).length).toBe(1);
});

test('removePreviousMilestone(milestone)', () => {
	const milestone = new Milestone();
	const milestone2 = new Milestone();
	milestone.addPreviousMilestone(milestone2);
	milestone.removePreviousMilestone(milestone2);
  expect(Object.keys(milestone.getPreviousMilestones()).length).toBe(0);
});

test('addRequirement()', () => {
	const milestone = new Milestone();
	milestone.addRequirement();
  expect(Object.keys(milestone.getRequirements()).length).toBe(1);
});

test('addRequirement(phase)', () => {
	const milestone = new Milestone();
	const requirement = new Requirement();
	milestone.addRequirement(requirement);
  expect(milestone.getRequirements()[0] == requirement).toBe(true);
});

test('removeRequirement(requirement)', () => {
	const milestone = new Milestone();
	const requirement = new Requirement();
	milestone.addRequirement(requirement);
	milestone.removeRequirement(requirement);
  expect(Object.keys(milestone.getRequirements()).length).toBe(0);
});

test('getRequirements()', () => {
	const milestone = new Milestone();
	Array(10).fill().map(() => milestone.addRequirement());
  expect(Object.keys(milestone.getRequirements()).length).toBe(10);
});

test('setStartDate(date)', () => {
	const milestone = new Milestone();
	const date = new Date();
	milestone.setStartDate(date);
	expect(milestone.getStartDate()).toBe(date);
});

test('setEndDate(date)', () => {
	const milestone = new Milestone();
	const date = new Date();
	milestone.setEndDate(date);
	expect(milestone.getEndDate()).toBe(date);
});

test('setNum(n)', () => {
	const milestone = new Milestone();
	milestone.setNum(2)
	expect(milestone.getNum()).toBe(2);
});