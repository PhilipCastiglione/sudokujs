// establish board
var board = [];
for (var cell = 0; cell < 81; cell++) {
  board.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
}

function row(cellIndex) {
  return Math.floor(cellIndex / 9) + 1;
}

function col(cellIndex) {
  return cellIndex % 9 + 1;
}

function quadrant(cellIndex) {
  return Math.floor((row(cellIndex) - 1) / 3) * 3 + Math.floor((col(cellIndex) - 1) / 3) + 1;
}

function cellsForIndices(indices) {
  return indices.map(function(i) {
    return board[i];
  });
}

function indicesInRow(row) {
  var index = (row - 1) * 9;
  var indices = [];
  for (var col = 0; col < 9; col++) {
    indices = indices.concat(index + col);
  }
  return indices;
}

function indicesInCol(col) {
  var indices = [];
  for (var row = 0; row < 9; row++) {
    indices = indices.concat(col - 1 + row * 9);
  }
  return indices;
}

function indicesInQuadrant(quadrant) {
  var firstIndex = Math.floor((quadrant - 1) / 3) * 9 * 3 + (quadrant - 1) % 3 * 3;
  var indices = [];
  for (var i = 0; i < 9; i++) {
    indices = indices.concat(firstIndex + Math.floor(i / 3) * 9 + i % 3);
  }
  return indices;
}

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

// apply input to board
function applyInputToBoard() {
  $.each($('input'), function(i, input) {
    if (input.value) {
      board[i] = [parseInt(input.value, 10)];
    }
  });
}

// solve
function solve() {
  removeInvalidOptions();
}

function removeInvalidOptions() {
  Object.keys(board).forEach(function(row) {
    Object.keys(board[row]).forEach(function(col) {
      if (board[row][col].length === 1) {
        clearRowOfNumber(row, board[row][col][0]);
        clearColOfNumber(col, board[row][col][0]);
      }
    });
  });
}

function clearRowOfNumber(row, number) {
  for (var col = 0; col < 9; col++) {
    if (board[row][col].length > 1) {
      board[row][col].remove(number);
    }
  }
}

function clearColOfNumber(col, number) {
  for (var row = 0; row < 9; row++) {
    if (board[row][col].length > 1) {
      board[row][col].remove(number);
    }
  }
}

Array.prototype.remove = function(value) {
  var index = this.indexOf(value);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};

// TODO
// decouple data structure

