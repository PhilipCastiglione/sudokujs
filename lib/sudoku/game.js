var game = {
  initialize: function() {
    board.populateCells();
    board.render('inputs');
    $('#run').click(function() {
      board.applyUserInput();
      // bind this?
      game.renderLoop();
      game.solve();
    });
    $('#sample-a').click(function() {
      applySetA();
      // bind this?
      game.renderLoop();
      game.solve();
    });
    $('#sample-b').click(function() {
      applySetB();
      // bind this?
      game.renderLoop();
      game.solve();
    });
  },
  renderLoop: function() {
    var renderLoop = setInterval(function() {
      board.render();
      // bind this?
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

