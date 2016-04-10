var rules = {
  // RULE 1
  updateSolvedCellRelatedCells: function() {
    board.cells.forEach(function(cell, i) {
      if (cell.length === 1) { // if a cell has only one number
        rules.removeNumberFromIndices(row, indicesInRow, i, cell[0]); // then for that row
        rules.removeNumberFromIndices(col, indicesInCol, i, cell[0]); // and column
        rules.removeNumberFromIndices(quadrant, indicesInQuadrant, i, cell[0]); // and quadrant
      }
    });
  },
  removeNumberFromIndices: function(segment, findIndicesFor, index, number) {
    var indices = findIndicesFor(segment(index));
    indices.forEach(function(i) {
      if (board.cells[i].length > 1) { // unless the cell only has that number
        board.cells[i].remove(number); // remove it
      }
    });
  },
  // RULE 2
  updateKnownSolvedCells: function() { // where a number appears only once in a
    this.updateKnownSolvedCellsWithIndices(indicesInRow); // row
    this.updateKnownSolvedCellsWithIndices(indicesInCol); // column
    this.updateKnownSolvedCellsWithIndices(indicesInQuadrant); // or quadrant
  },
  updateKnownSolvedCellsWithIndices: function(findIndicesFor) {
    for (var seg = 1; seg <= 9; seg++) {
      var indices = findIndicesFor(seg);
      var cells = cellsForIndices(indices);
      for (var number = 1; number <= 9; number++) {
        if (cells.cellsWith(number).length === 1) {
          var localIndex = cells.findNestedIndex(number);
          board.cells[indices[localIndex]] = [number]; // then remove other numbers from the cell where it is
        }
      }
    }
  },
  // RULE 3
  updateQuadrantSolvedCellsRelatedCells: function() { // if all instances of a number, for a quadrant, are in a
    this.updateQuadrantSolvedCellsUsing(row, indicesInRow); // row
    this.updateQuadrantSolvedCellsUsing(col, indicesInCol); // or column
  },
  updateQuadrantSolvedCellsUsing: function(segment, findIndicesFor) {
    for (var quadrant = 1; quadrant <= 9; quadrant++) {
      var indices = indicesInQuadrant(quadrant);
      var cells = cellsForIndices(indices);
      for (var number = 1; number <= 9; number++) {
        var localIndices = [];
        cells.forEach(function(cell, i) {
          if (cell.includes(number)) {
            localIndices.push(i);
          }
        });
        if (localIndices.length > 1 &&
            localIndices.filter(function(i) {
              return segment(indices[i]) === segment(indices[localIndices[0]]);
            }).length === localIndices.length) {
          var segmentIndices = findIndicesFor(segment(indices[localIndices[0]]));
          var quadrantIndices = indicesInQuadrant(quadrant);
          quadrantIndices.forEach(function(qi) {
            segmentIndices.remove(qi);
          });
          segmentIndices.forEach(function(si) { // for other cells in that row or column
            board.cells[si].remove(number); // remove that number
          });
        }
      }
    }
  },
  // RULE 4
  updateAxisSolvedCellsRelatedCells: function() { // if all instances of a number are in the same quadrant
    this.updateAxisSolvedCellsUsing(indicesInRow); // for a given row
    this.updateAxisSolvedCellsUsing(indicesInCol); // or column
  },
  updateAxisSolvedCellsUsing: function(findIndicesFor) {
    for (var seg = 1; seg <= 9; seg++) {
      var indices = findIndicesFor(seg);
      for (var number = 1; number <= 9; number++) {
        var indicesWithNumber = indices.filter(function(i) { return board.cells[i].includes(number); });
        var indicesQuadrants = indicesWithNumber.map(function(i) { return quadrant(i); });
        if (indicesWithNumber.length > 1 &&
            indicesQuadrants.unique().length === 1) {
          var localIndices = indicesInQuadrant(indicesQuadrants[0]);
          indicesWithNumber.forEach(function(i) {
            localIndices.remove(i);
          });
          localIndices.forEach(function(i) {
            board.cells[i].remove(number); // then remove that number from elsewhere in the quadrant
          });
        }
      }
    }
  },
  // RULE 5
  updateXIdenticalCells: function() { // if x numbers exist in x cells
    this.updateXIdenticalCellsUsing(indicesInRow); // for a given row
    this.updateXIdenticalCellsUsing(indicesInCol); // cell
    this.updateXIdenticalCellsUsing(indicesInQuadrant); // or quadrant
  },
  updateXIdenticalCellsUsing(findIndicesFor) {
    for (var seg = 1; seg <= 9; seg++) {
      var indicesInSegment = findIndicesFor(seg);
      var cellsInSegment = cellsForIndices(indicesInSegment);
      cellsInSegment.forEach(function(cell) {
        if (cellsInSegment.filter(function(comparisonCell) {
              return cell === comparisonCell;
            }).length === cell.length) {
          cell.forEach(function(number) { // then for each number
            indicesInSegment.forEach(function(i) {
              if (board.cells[i] !== cell) { // for other cells in that segment
                board.cells[i].remove(number); // remove the number
              }
            });
          });
        }
      });
    }
  },
  // RULE 6
  updateXPossibilitiesOfYCombinations: function() {
    if (this.numberCombinations === undefined) { // using state to save lots of cpu cycles
      this.generateNumberCombinations();
    }
    this.updateXPossibilitiesOfYCombinationsUsing(indicesInRow);
    this.updateXPossibilitiesOfYCombinationsUsing(indicesInCol);
    this.updateXPossibilitiesOfYCombinationsUsing(indicesInQuadrant);
  },
  generateNumberCombinations: function() {
    this.numberCombinations = {};
    for (var combination = 2; combination <= 4; combination++) { // this should go to 8, but in the interest of processing time, limited to 4
      this.numberCombinations[combination] = this.buildCombinations(combination);
    }
  },
  buildCombinations: function(max) {
    var numbers = [[1],[2],[3],[4],[5],[6],[7],[8],[9]];
    var combinedNumbers = numbers;
    while (combinedNumbers[0].length < max) {
      combinedNumbers = combinedNumbers.map(function(a) {
        return numbers.map(function(b) {
          return a.concat(b);
        });
      }).reduce(function(a, b) {
        return a.concat(b);
      });
    }
    return combinedNumbers.filter(function(a) {
      return a.length === a.unique().length;
    });
  },
  updateXPossibilitiesOfYCombinationsUsing: function(findIndicesFor) {
    for (var seg = 1; seg <= 9; seg++) {
      this.findPossibilitiesWithin(findIndicesFor(seg));
    }
  },
  findPossibilitiesWithin(indices) {
    Object.keys(this.numberCombinations).forEach(function(numberOfPossibilities) {
      rules.numberCombinations[numberOfPossibilities].forEach(function(combination) {
        var indicesWithPossibility = [];
        indices.forEach(function(i) {
          var cell = board.cells[i].filter(function(number) {
            return !combination.includes(number);
          });
          if (cell.length === board.cells[i].length - numberOfPossibilities) {
            indicesWithPossibility.push(i);
          }
        });
        if (indicesWithPossibility.length === numberOfPossibilities) {
          indicesWithPossibility.forEach(function(i) {
            board.cells[i] = combination;
          });
        }
      });
    });
  },
  // BRUTE FORCE THE REST :(
  hulkSmash: function() {
    // store the board state, go through each cell and apply a number
    // try and solve - if you lose and 
    // if the number doesn't result in an invalid move, return the board
    // state, try the next number in the same cell
    // when you run out of numbers try the next cell
    // if the number choice DOES result in an invalid board, reapply the
    // board, then remove the number from the cell and restart solve
  }
};
