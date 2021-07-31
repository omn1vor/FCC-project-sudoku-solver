const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()

let testString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let testSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.equal(solver.validate(testString), undefined);      
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.equal(solver.validate('a' + testString.slice(1, 81)).error, 'Invalid characters in puzzle');      
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.equal(solver.validate('1' + testString).error, 'Expected puzzle to be 81 characters long');      
  });

  test('Logic handles a valid row placement', () => {
    assert.equal(solver.checkRowPlacement(testString, 'a', '2', '2'), true);      
  });

  test('Logic handles an invalid row placement', () => {
    assert.equal(solver.checkRowPlacement(testString, 'a', '2', '9'), false);      
  });

  test('Logic handles a valid column placement', () => {
    assert.equal(solver.checkColPlacement(testString, 'a', '2', '1'), true);      
  });

  test('Logic handles an invalid column placement', () => {
    assert.equal(solver.checkColPlacement(testString, 'a', '2', '9'), false);      
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.equal(solver.checkRegionPlacement(testString, 'a', '2', '1'), true);      
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.equal(solver.checkRegionPlacement(testString, 'a', '2', '5'), false);      
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.notExists(solver.solve(testString).error);      
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.exists(solver.solve('a' + testString).error);      
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solve(testString).solution, testSolution);      
  });


});
