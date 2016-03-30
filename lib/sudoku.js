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

game.initialize();
