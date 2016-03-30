function solve() {
  if (game.isWon()) {
    alert('win');
  } else {
    var initialChecksum = board.checksum();
    rules.updateSolvedCellRelatedCells();
    if (initialChecksum !== board.checksum()) {
      solve();
    } else {
      rules.updateKnownSolvedCells();
      if (initialChecksum !== board.checksum()) {
        solve();
      } else {
        rules.updateQuadrantSolvedCellsRelatedCells();
        if (initialChecksum !== board.checksum()) {
          solve();
        } else {
          game.failed = true;
          alert('lost');
        }
      }
    }
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

game.initialize();
