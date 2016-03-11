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

