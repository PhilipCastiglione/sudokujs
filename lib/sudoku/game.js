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
    $('#sample-c').click(function() {
      applySetC();
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
    var rules = window.rules;
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
            rules.updateAxisSolvedCellsRelatedCells();
            if (initialChecksum !== board.checksum()) {
              this.solve();
            } else {
              rules.updateXIdenticalCells();
              if (initialChecksum !== board.checksum()) {
                this.solve();
              } else {
                rules.updateXPossibilitiesOfYCombinations();
                if (initialChecksum !== board.checksum()) {
                  this.solve();
                } else {
                  rules.hulkSmash();
                }
              }
            }
          }
        }
      }
    }
  },
  isWon: function() {
    return board.checksum() === board.cells.length && !isInvalid();
  },
  isLost: function() {
    return this.failed || isInvalid();
  },
  failed: false
};

