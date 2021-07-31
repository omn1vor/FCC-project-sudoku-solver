const examples = require('./puzzle-strings');
class SudokuSolver {

  validate(puzzleString) {    
    let regex = /[1-9\.]/;
    
    if (!puzzleString.split('').every(i => regex.test(i))) return { error: 'Invalid characters in puzzle' };
    if (puzzleString.length != 81) return { error: 'Expected puzzle to be 81 characters long' };

  }

  checkRowPlacement(puzzleString, row, column, value) {
    //let index = this.getIndex(row, column);
    //let rowStart = Math.floor(index / 9) * 9;
    //let rowEnd = rowStart + 8;
    let rowIndex = this.getRowIndex(row);
    let colIndex = column - 1;
    let square = this.getSquare(puzzleString);
    let count = 0;

    square[rowIndex][colIndex].value = value;
    
    for (let i = 0; i < 9; i++) {
      if (square[rowIndex][i].value == value) {        
        count++;
      }
    }

    return (count <= 1);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rowIndex = this.getRowIndex(row);
    let colIndex = column - 1;
    let square = this.getSquare(puzzleString);
    let count = 0;

    square[rowIndex][colIndex].value = value;
    
    for (let i = 0; i < 9; i++) {
      if (square[i][colIndex].value == value) {        
        count++;
      }
    }

    return (count <= 1);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowIndex = this.getRowIndex(row);
    let colIndex = column - 1;
    let square = this.getSquare(puzzleString);
    let count = 0;

    square[rowIndex][colIndex].value = value;
     
    for (let i = Math.floor(rowIndex / 3) * 3; i < Math.floor(rowIndex / 3) * 3 + 3; i++) {
      for (let j = Math.floor(colIndex / 3) * 3; j < Math.floor(colIndex / 3) * 3 + 3; j++) {        
        if (square[i][j].value == value) {        
          count++;
        }
      }      
    }

    return (count <= 1);
  }

  solve(puzzleString) {
    let square = this.getSquare(puzzleString);    

    while (true) {

      let madeProgress = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {        
          if (square[i][j].value !== '.') {
            continue;
          }
          let possibilities = square[i][j].possibilities.slice();
          if (!possibilities.length) {
            for (let index = 1; index < 10; index++) {
              possibilities.push(index);
            }
          }
          let newPossibilities = possibilities.filter(value => this.checkSquarePlacement(square, i, j, value));
          if (newPossibilities.length === 0) {
            return { error: 'Puzzle cannot be solved' };
          } else if (newPossibilities.length === 1) {
            square[i][j].value = newPossibilities[0];
            square[i][j].possibilities = [];
            madeProgress = true;            
          } else {
            square[i][j].possibilities = newPossibilities;
          }
        }
      }

      if (!madeProgress) break;
    }
    return { solution: this.getPuzzleString(square) };

  }

  getIndex(row, column) {
    let rowIndex = row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    return rowIndex * 9 + column - 1;
  }

  getRowIndex(row) {
    return row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  }

  getSquare(puzzleString) {
    let square = [[]];
    let row = 0;
    let col = 0;

    for (let i = 0; i < puzzleString.length && i < 81; i++) {
      if (Math.floor(i / 9) > row) {
        row++;
        square[row] = []
      }
      col = i - 9 * row;
      square[row][col] = { value: puzzleString[i] || '.', possibilities: [] };
    }

    return square;
  }

  getPuzzleString(square) {
    let puzzle = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {        
        puzzle.push(square[i][j].value);
      }
    }

    return puzzle.join('');
  }

  checkPlacement(puzzleString, row, column, value) {
    
    let conflicts = [];

    if (!this.checkRowPlacement(puzzleString, row, column, value)) {
      conflicts.push('row');
    }

    if (!this.checkColPlacement(puzzleString, row, column, value)) {
      conflicts.push('column');
    }

    if (!this.checkRegionPlacement(puzzleString, row, column, value)) {
      conflicts.push('region');
    }

    if (conflicts.length) {
      return { valid: false, conflict: conflicts };
    }

    return { valid: true };

  }

  checkSquarePlacement(square, rowIndex, colIndex, value) {
    
    for (let i = 0; i < 9; i++) {
      if (square[rowIndex][i].value == value) return false;
    }

    for (let i = 0; i < 9; i++) {
      if (square[i][colIndex].value == value) return false;
    }

    for (let i = Math.floor(rowIndex / 3) * 3; i < Math.floor(rowIndex / 3) * 3 + 3; i++) {
      for (let j = Math.floor(colIndex / 3) * 3; j < Math.floor(colIndex / 3) * 3 + 3; j++) {        
        if (square[i][j].value == value) return false;
      }      
    }

    return true;
  }

}

module.exports = SudokuSolver;

