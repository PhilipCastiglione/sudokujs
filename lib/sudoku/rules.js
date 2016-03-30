var rules = {
  // RULE 1
  updateSolvedCellRelatedCells: function() {
    board.cells.forEach(function(cell, i) {
      if (cell.length === 1) {
        // bind this appropriately? or jquery requires it
        rules.removeNumberFromIndices(row, indicesInRow, i, cell[0]);
        rules.removeNumberFromIndices(col, indicesInCol, i, cell[0]);
        rules.removeNumberFromIndices(quadrant, indicesInQuadrant, i, cell[0]);
      }
    });
  },
  removeNumberFromIndices: function(segment, findIndicesFor, index, number) {
    var indices = findIndicesFor(segment(index));
    indices.forEach(function(i) {
      if (board.cells[i].length > 1) {
        board.cells[i].remove(number);
      }
    });
  },
  // RULE 2
  updateKnownSolvedCells: function() {
    this.updateKnownSolvedCellsWithIndices(indicesInRow);
    this.updateKnownSolvedCellsWithIndices(indicesInCol);
    this.updateKnownSolvedCellsWithIndices(indicesInQuadrant);
  },
  updateKnownSolvedCellsWithIndices: function(findIndicesFor) {
    for (var seg = 1; seg <= 9; seg++) {
      var indices = findIndicesFor(seg);
      var cells = cellsForIndices(indices);
      for (var number = 1; number <= 9; number++) {
        if (cells.cellsWith(number).length === 1) {
          var localIndex = cells.findNestedIndex(number);
          board.cells[indices[localIndex]] = [number];
        }
      }
    }
  },
  // RULE 3
  updateQuadrantSolvedCellsRelatedCells: function() {
    this.updateQuadrantSolvedCellsUsing(row);
    this.updateQuadrantSolvedCellsUsing(col);
  },
  updateQuadrantSolvedCellsUsing: function(segment) {
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
        // here I have all the indices for a number n
        if (localIndices.length > 1 &&
            localIndices.filter(function(i) {
              return segment(indices[i]) === segment(indices[localIndices[0]]);
            }).length === localIndices.length) {
          var segmentIndices = indicesInRow(segment(indices[localIndices[0]]));
          var quadrantIndices = indicesInQuadrant(quadrant);
          quadrantIndices.forEach(function(qi) {
            segmentIndices.remove(qi);
          });
          //rules.removeNumberFromIndices(quadrant, indicesInQuadrant, , number);
        }
      }
    }
  },
  // RULE 4
};
