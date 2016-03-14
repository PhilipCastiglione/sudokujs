Array.prototype.remove = function(value) {
  var index = this.indexOf(value);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};

Array.prototype.unsolvedCellsWith = function(value) {
  return this.filter(function(element) {
    return element.includes(value) && element.length !== 1;
  });
}

Array.prototype.findNestedIndex = function(value) {
  return this.findIndex(function(element) {
    return element.includes(value);
  });
}

function row(index) {
  return Math.floor(index / 9) + 1;
}

function col(index) {
  return index % 9 + 1;
}

function quadrant(index) {
  return Math.floor((row(index) - 1) / 3) * 3 + Math.floor((col(index) - 1) / 3) + 1;
}

function cellsForIndices(indices) {
  return indices.map(function(i) {
    return board.cells[i];
  });
}

function applyFormulaToGetIndices(formula) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(formula);
}

function indicesInRow(row) {
  return applyFormulaToGetIndices(function(i) {
    return (row - 1) * 9 + i;
  });
}

function indicesInCol(col) {
  return applyFormulaToGetIndices(function(i) {
    return col - 1 + i * 9;
  });
}

function indicesInQuadrant(quadrant) {
  return applyFormulaToGetIndices(function(i) {
    return Math.floor((quadrant - 1) / 3) * 9 * 3 + (quadrant - 1) % 3 * 3 + Math.floor(i / 3) * 9 + i % 3;
  });
}

