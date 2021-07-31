'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let err;
      
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      err = solver.validate(req.body.puzzle);      
      if (err) return res.json(err);

      if (!/[a-iA-I][1-9]/.test(req.body.coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (req.body.value.length > 1 || !/[1-9]/.test(req.body.value)) {
        return res.json({ error: 'Invalid value' });
      }

      res.json(solver.checkPlacement(req.body.puzzle, req.body.coordinate.slice(0, 1), req.body.coordinate.slice(1, 2), req.body.value));

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let err;
      
      if (!req.body.puzzle) return res.json({ error: 'Required field missing' });

      err = solver.validate(req.body.puzzle);
      if (err) return res.json(err);
      
      res.json(solver.solve(req.body.puzzle));

    });
};
