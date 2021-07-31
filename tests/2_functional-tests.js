const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let testSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

suite('Functional Tests', () => {
  
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: testString })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, testSolution);        
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });      
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: 'a' + testString.slice(1, 81) })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1' + testString })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '9' + testString.slice(1, 81) })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: testString, coordinate: 'a2', value: '1' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: testString, coordinate: 'a2', value: '1' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body.valid);
        assert.exists(res.body.conflict);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: testString, coordinate: 'a2', value: '4' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body.valid);
        assert.exists(res.body.conflict);
        assert.isAbove(res.body.conflict.length, 1);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: testString, coordinate: 'a2', value: '5' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body.valid);
        assert.exists(res.body.conflict);
        assert.isAbove(res.body.conflict.length, 2);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: testString, value: '5' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');        
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: 'a' + testString.slice(1, 81), coordinate: 'a2', value: '5' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');        
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1' + testString, coordinate: 'a2', value: '5' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: testString, coordinate: 'k2', value: '5' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: testString, coordinate: 'a2', value: '11' })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});

