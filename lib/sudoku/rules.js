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
          segmentIndices.forEach(function(si) {
            board.cells[si].remove(number); // remove them
          });
        }
      }
    }
  },
  // RULE 4
};
