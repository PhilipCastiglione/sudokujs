function setupBoard() {
  var board = [];
  for (var cell = 0; cell < 81; cell++) {
    board.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
}

function boardChecksum() {
  return board.reduce(function(sum, cell) {
    return sum + cell.length;
  }, 0);
}

