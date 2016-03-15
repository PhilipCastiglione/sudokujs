function solve() {
  var initialChecksum = board.checksum();
  updateSolvedCellRelatedCells();
  if (initialChecksum !== board.checksum()) {
    solve();
  } else {
    updateKnownSolvedCells();
    if (initialChecksum !== board.checksum()) {
      solve();
    } else {
      updateQuadrantSolvedCellsRelatedCells();
    }
  }
}

function updateSolvedCellRelatedCells() {
  board.cells.forEach(function(cell, i) {
    if (cell.length === 1) {
      removeNumberFromRow(row(i), cell[0]);
      removeNumberFromCol(col(i), cell[0]);
      removeNumberFromQuadrant(quadrant(i), cell[0]);
    }
  });
}

function removeNumberFromIndices(number, indices) {
  indices.forEach(function(i) {
    if (board.cells[i].length > 1) {
      board.cells[i].remove(number);
    }
  });
}

function removeNumberFromRow(row, number) {
  var indices = indicesInRow(row);
  removeNumberFromIndices(number, indices);
}

function removeNumberFromCol(col, number) {
  var indices = indicesInCol(col);
  removeNumberFromIndices(number, indices);
}

function removeNumberFromQuadrant(quadrant, number) {
  var indices = indicesInQuadrant(quadrant);
  removeNumberFromIndices(number, indices);
}

function updateKnownSolvedCells() {
  updateKnownSolvedCellsInRows();
  updateKnownSolvedCellsInCols();
  updateKnownSolvedCellsInQuadrants();
}

function updateKnownSolvedCellsWithIndices(findIndicesFor) {
  for (var gridSegment = 1; gridSegment <= 9; gridSegment++) {
    var indices = findIndicesFor(gridSegment);
    var cells = cellsForIndices(indices);
    for (var number = 1; number <= 9; number++) {
      if (cells.unsolvedCellsWith(number).length === 1) {
        var localIndex = cells.findNestedIndex(number);
        board.cells[indices[localIndex]] = [number];
      }
    }
  }
}

function updateKnownSolvedCellsInRows() {
  updateKnownSolvedCellsWithIndices(indicesInRow);
}

function updateKnownSolvedCellsInCols() {
  updateKnownSolvedCellsWithIndices(indicesInCol);
}

function updateKnownSolvedCellsInQuadrants() {
  updateKnownSolvedCellsWithIndices(indicesInQuadrant);
}

function updateQuadrantSolvedCellsRelatedCells() {
  updateQuadrantSolvedCellsUsing(row);
  updateQuadrantSolvedCellsUsing(col);
}

function updateQuadrantSolvedCellsUsing(segment) {
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
        var segmentIndices = indicesInRow(segment(indices[localIndices[0]]));
        var quadrantIndices = indicesInQuadrant(quadrant);
        quadrantIndices.forEach(function(qi) {
          segmentIndices.remove(qi);
        });
        removeNumberFromIndices(number, segmentIndices);
      }
    }
  }
}

function setupPage() {
 board.initialize();
 board.render('inputs');
 $('#button').click(function() {
   board.applyUserInput();
   board.render();
   // begin render loop
   // begin solve loop
 });
}

setupPage();
