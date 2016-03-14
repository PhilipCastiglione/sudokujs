var board = {
  cells: [],
  setup: function() {
    for (var cell = 0; cell < 81; cell++) {
      this.cells.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  },
  checksum() {
    return this.cells.reduce(function(sum, cell) {
      return sum + cell.length;
    }, 0);
  }
};

