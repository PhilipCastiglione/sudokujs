// render
// board object
// solving functions
//

// establish board
var board = {};
for (var row = 0; row < 9; row++) {
  board[row] = {};
  for (var col = 0; col < 9; col++) {
    board[row][col] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
}

// render
function render() {
  var $grid = $('<div>').attr('class', 'grid');
  Object.keys(board).forEach(function(row) {
    var $row = $('<div>').attr('class', 'row');
    Object.keys(board[row]).forEach(function(col) {
      var $col = $('<div>').attr('class', 'col cell')
                           .html(board[row][col]);
      $row.append($col);
    });
    $grid.append($row);
  });
  $('#grid-wrapper').html($grid);
}

// setup input
function setupInput() {
  var $grid = $('<div>').attr('class', 'grid');
  Object.keys(board).forEach(function(row) {
    var $row = $('<div>').attr('class', 'row');
    Object.keys(board[row]).forEach(function(col) {
      var $col = $('<div>').attr('class', 'col cell')
                           .html($('<input>'));
      $row.append($col);
    });
    $grid.append($row);
  });
  $('#grid-wrapper').html($grid);
}

// apply input to board
function applyInputToBoard() {
  $.each($('.row'), function(row, rowElement) {
    $.each($(rowElement).find('input'), function(col, input) {
      if (input.value) {
        board[row][col] = parseInt(input.value, 10);
      }
    });
  });
}
