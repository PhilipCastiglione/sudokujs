var game = {
  initialize: function() {
    board.populateCells();
    board.render('inputs');
    $('#button').click(function() {
      board.applyUserInput();
      // bind this?
      game.renderLoop();
      solve();
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
  isWon: function() {
    return board.checksum() === board.cells.length;
  },
  isLost: function() {
    return this.failed;
  },
  failed: false
};

