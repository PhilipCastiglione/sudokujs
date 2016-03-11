function setupBoard() {
  var board = [];
  for (var cell = 0; cell < 81; cell++) {
    board.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
}

function row(index) {
  return Math.floor(index / 9) + 1;
}

function col(index) {
  return index % 9 + 1;
}

function quadrant(index) {
  return Math.floor((row(index) - 1) / 3) * 3 + Math.floor((col(index) - 1) / 3) + 1;
}

function cellsForIndices(indices) {
  return indices.map(function(i) {
    return board[i];
  });
}

function applyFormulaToGetIndices(formula) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(formula);
}

function indicesInRow(row) {
  return applyFormulaToGetIndices(function(i) {
    return (row - 1) * 9 + i;
  });
}

function indicesInCol(col) {
  return applyFormulaToGetIndices(function(i) {
    return col - 1 + i * 9;
  });
}

function indicesInQuadrant(quadrant) {
  return applyFormulaToGetIndices(function(i) {
    return Math.floor((quadrant - 1) / 3) * 9 * 3 + (quadrant - 1) % 3 * 3 + Math.floor(i / 3) * 9 + i % 3;
  });
}

function renderBoard() {
  var $grid = $('<div>').attr('class', 'grid');
  var $row = $('<div>').attr('class', 'row');
  for (var i = 0; i < 81; i++) {
    var $cell = $('<div>').attr('class', 'col cell')
                          .html(board[i]);
    $row.append($cell);
    if (col(i) === 9) {
      $grid.append($row);
      var $row = $('<div>').attr('class', 'row');
    }
  }
  $('#grid-wrapper').html($grid);
}

// these need to be refactored into above render at some point
function renderIndices() {
  var $grid = $('<div>').attr('class', 'grid');
  var $row = $('<div>').attr('class', 'row');
  for (var i = 0; i < 81; i++) {
    var $cell = $('<div>').attr('class', 'col cell')
                          .html(i);
    $row.append($cell);
    if (col(i) === 9) {
      $grid.append($row);
      var $row = $('<div>').attr('class', 'row');
    }
  }
  $('#grid-wrapper').html($grid);
}


function renderInput() {
  var $grid = $('<div>').attr('class', 'grid');
  var $row = $('<div>').attr('class', 'row');
  for (var i = 0; i < 81; i++) {
    var $cell = $('<div>').attr('class', 'col cell')
                          .html($('<input>'));
    $row.append($cell);
    if (col(i) === 9) {
      $grid.append($row);
      var $row = $('<div>').attr('class', 'row');
    }
  }
  $('#grid-wrapper').html($grid);
}

function applyInputToBoard() {
  $.each($('input'), function(i, input) {
    if (input.value) {
      board[i] = [parseInt(input.value, 10)];
    }
  });
}

function boardChecksum() {
  return board.reduce(function(sum, cell) {
    return sum + cell.length;
  }, 0);
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

Array.prototype.remove = function(value) {
  var index = this.indexOf(value);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};

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

Array.prototype.unsolvedCellsWith = function(value) {
  return this.filter(function(element) {
    return element.includes(value) && element.length !== 1;
  });
}

Array.prototype.findNestedIndex = function(value) {
  return this.findIndex(function(element) {
    return element.includes(value);
  });
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
