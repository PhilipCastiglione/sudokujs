var board = {
  cells: [],
  initialize: function() {
    for (var cell = 0; cell < 81; cell++) {
      this.cells.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  },
  applyUserInput: function() {
    $.each($('input'), function(i, input) {
      if (input.value) {
        // bind this appropriately? or jquery requires it
        board.cells[i] = [parseInt(input.value, 10)];
      }
    });
  },
  checksum() {
    return this.cells.reduce(function(sum, cell) {
      return sum + cell.length;
    }, 0);
  },
  render(modifier) {
    var $grid = $('<div>').attr('class', 'grid');
    var $row = $('<div>').attr('class', 'row');
    for (var i = 0; i < 81; i++) {
      var $cell = $('<div>').attr('class', 'col cell');
      // modifier flag is not a nice way to do this
      if (modifier === 'indices') {
        $cell.html(i);
      } else if (modifier === 'inputs') {
        $cell.html($('<input>'));
      } else {
        $cell.html(board.cells[i]);
      }
      $row.append($cell);
      if (col(i) === 9) {
        $grid.append($row);
        var $row = $('<div>').attr('class', 'row');
      }
    }
    $('#grid-wrapper').html($grid);
  },
  renderInputs() {
    render('inputs');
  },
  renderIndices() {
    render('indices');
  }
};

