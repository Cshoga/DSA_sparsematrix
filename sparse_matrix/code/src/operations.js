#!/usr/bin/env node

const SparseMatrix = require('./matrix');

/**
 * Add two sparse matrices
 */
function add(A, B) {
  // Check dimensions
  if (A.numRows !== B.numRows || A.numCols !== B.numCols) {
    throw new Error('Matrix dimensions must match for addition');
  }

  const result = new SparseMatrix(A.numRows, A.numCols);

  // Copy all elements from A to result
  for (const r in A.data) {
    for (const c in A.data[r]) {
      result.setElement(parseInt(r), parseInt(c), A.data[r][c]);
    }
  }

  // Add elements from B
  for (const r in B.data) {
    for (const c in B.data[r]) {
      const current = result.getElement(parseInt(r), parseInt(c));
      result.setElement(parseInt(r), parseInt(c), current + B.data[r][c]);
    }
  }

  return result;
}

/**
 * Subtract matrix B from matrix A
 */
function subtract(A, B) {
  // Check dimensions
  if (A.numRows !== B.numRows || A.numCols !== B.numCols) {
    throw new Error('Matrix dimensions must match for subtraction');
  }

  const result = new SparseMatrix(A.numRows, A.numCols);

  // Copy all elements from A to result
  for (const r in A.data) {
    for (const c in A.data[r]) {
      result.setElement(parseInt(r), parseInt(c), A.data[r][c]);
    }
  }

  // Subtract elements from B
  for (const r in B.data) {
    for (const c in B.data[r]) {
      const current = result.getElement(parseInt(r), parseInt(c));
      result.setElement(parseInt(r), parseInt(c), current - B.data[r][c]);
    }
  }

  return result;
}

/**
 * Multiply two sparse matrices
 */
function multiply(A, B) {
  // Check if multiplication possible (A cols == B rows)
  if (A.numCols !== B.numRows) {
    throw new Error('Number of columns of A must equal number of rows of B for multiplication');
  }

  const result = new SparseMatrix(A.numRows, B.numCols);

  // Multiply sparse matrices using only non-zero values
  for (const rA in A.data) {
    for (const cA in A.data[rA]) {
      const valA = A.data[rA][cA];
      const rowA = parseInt(rA);
      const colA = parseInt(cA);

      if (B.data[colA]) {
        for (const cB in B.data[colA]) {
          const valB = B.data[colA][cB];
          const colB = parseInt(cB);

          const oldVal = result.getElement(rowA, colB);
          result.setElement(rowA, colB, oldVal + valA * valB);
        }
      }
    }
  }

  return result;
}

module.exports = {
  add,
  subtract,
  multiply,
};
