function solve() {
  //var start = new Date().getTime();
  var initialChecksum = board.checksum();

  run(updateSolvedCellRelatedCells);
  run(updateKnownSolvedCells);
  //run(updateQuadrantSolvedCellsRelatedCells);

  if (initialChecksum !== board.checksum()) {
    solve();
  //} else if (game.isWon()) {
    //alert('win');
  } else {
    game.failed = true;
    alert('lost');
  }
}

function run(rule) {
  if (game.isWon()) {
    alert('win');
  } else {
    rule();
  }
}

function isInvalid() {
  return isInvalidSegment(indicesInRow) &&
         isInvalidSegment(indicesInCol) &&
  isInvalidSegment(indicesInQuadrant);
}

function isInvalidSegment(indicesInSegment) {
  for (var number = 1; number <= 9; number++) {
    for (var seg = 1; seg <= 9; seg++) {
      if (cellsForIndices(indicesInSegment(seg)).filter(function(cell) {
        return cell.includes(number);
      }).length === 0) {
        return true;
      }
    }
  }
  return false;
}

// RULE 1
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

// RULE 2
function updateKnownSolvedCells() {
  updateKnownSolvedCellsWithIndices(indicesInRow);
  updateKnownSolvedCellsWithIndices(indicesInCol);
  updateKnownSolvedCellsWithIndices(indicesInQuadrant);
}

function updateKnownSolvedCellsWithIndices(findIndicesFor) {
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
}

// RULE 3
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

// RULE 4



game.initialize();
