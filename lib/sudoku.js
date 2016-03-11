function applyInputToBoard() {
  $.each($('input'), function(i, input) {
    if (input.value) {
      board[i] = [parseInt(input.value, 10)];
    }
  });
}

function solve() {
  var initialChecksum = boardChecksum();
  updateSolvedCellRelatedCells();
  if (initialChecksum !== boardChecksum()) {
    solve();
  } else {
    updateKnownSolvedCells();
    if (initialChecksum !== boardChecksum()) {
      solve();
    } else {
      updateIntraQuadrantSolvedCellsRelatedCells();
    }
  }
}

function updateSolvedCellRelatedCells() {
  board.forEach(function(cell, i) {
    if (cell.length === 1) {
      clearRowOfNumber(row(i), cell[0]);
      clearColOfNumber(col(i), cell[0]);
      clearQuadrantOfNumber(quadrant(i), cell[0]);
    }
  });
}

function removeNumberFromIndices(number, indices) {
  indices.forEach(function(i) {
    if (board[i].length > 1) {
      board[i].remove(number);
    }
  });
}

function clearRowOfNumber(row, number) {
  var indices = indicesInRow(row);
  removeNumberFromIndices(number, indices);
}

function clearColOfNumber(col, number) {
  var indices = indicesInCol(col);
  removeNumberFromIndices(number, indices);
}

function clearQuadrantOfNumber(quadrant, number) {
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
        board[indices[localIndex]] = [number];
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
  updateQuadrantSolvedCellsRelatedRows();
  updateQuadrantSolvedCellsRelatedCols();
}

function updateQuadrantSolvedCellsRelatedRows() {
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
            return row(i) === row(localIndices[0]);
          }).length === localIndices.length) {
        // here, there is more than one instance of number, and they are all in the same row
      }
    }
  }
  
  //removeNumberFromIndices(number, indices);
}

function setupPage() {
 setupBoard();
 renderInput();
 $('#button').click(function() {
   applyInputToBoard();
   renderBoard();
   // begin render loop
   // begin solve loop
 });
}

setupPage();
