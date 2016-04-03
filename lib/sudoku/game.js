var game = {
  initialize: function() {
    board.populateCells();
    board.render('inputs');
    $('#run').click(function() {
      board.applyUserInput();
      game.renderLoop();
      game.solve();
    });
    $('#sample-a').click(function() {
      applySetA();
      game.renderLoop();
      game.solve();
    });
    $('#sample-b').click(function() {
      applySetB();
      game.renderLoop();
      game.solve();
    });
  },
  renderLoop: function() {
    var renderLoop = setInterval(function() {
      board.render();
      if (game.isWon() || game.isLost()) {
        clearInterval(renderLoop);
      }
    }, 50);
  },
  solve: function() {
    if (this.isWon()) {
      alert('win');
    } else {
      var initialChecksum = board.checksum();
      rules.updateSolvedCellRelatedCells();
      if (initialChecksum !== board.checksum()) {
        this.solve();
      } else {
        rules.updateKnownSolvedCells();
        if (initialChecksum !== board.checksum()) {
          this.solve();
        } else {
          rules.updateQuadrantSolvedCellsRelatedCells();
          if (initialChecksum !== board.checksum()) {
            this.solve();
          } else {
            this.failed = true;
            alert('lost');
          }
        }
      }
    }
  },
  isWon: function() {
    return board.checksum() === board.cells.length;
  },
  isLost: function() {
    return this.failed;
  },
  failed: false
};

