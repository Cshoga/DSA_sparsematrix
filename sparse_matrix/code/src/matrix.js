const fs = require('fs');
const path = require('path');

/**
 * SparseMatrix class to represent and manipulate sparse matrices.
 * A sparse matrix is a matrix with mostly zero values.
 * This class stores only the non-zero elements to save space.
 */

class SparseMatrix {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.elements = {}; // Store elements as a dictionary with keys like 'row,col'
  }

  /**
   * Load matrix from a text file.
   * Expected format:
   * rows=number
   * cols=number
   * (row, col, value)
   */
  static fromFile(filePath) {
    const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (!lines[0].startsWith("rows=") || !lines[1].startsWith("cols=")) {
      throw new Error("Input file has wrong format: Missing rows or cols line.");
    }

    const numRows = parseInt(lines[0].split('=')[1]);
    const numCols = parseInt(lines[1].split('=')[1]);
    const matrix = new SparseMatrix(numRows, numCols);

    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];

      if (!(line.startsWith('(') && line.endsWith(')'))) {
        throw new Error("Input file has wrong format: Bad parenthesis format.");
      }

      const parts = line.slice(1, -1).split(',');
      if (parts.length !== 3) {
        throw new Error("Input file has wrong format: Wrong number of values.");
      }

      const row = parseInt(parts[0].trim());
      const col = parseInt(parts[1].trim());
      const value = parseInt(parts[2].trim());

      if (isNaN(row) || isNaN(col) || isNaN(value)) {
        throw new Error("Input file has wrong format: Non-integer value found.");
      }

      matrix.setElement(row, col, value);
    }

    return matrix;
  }

  /**
   * Get the value at the given row and column.
   * Returns 0 if no value is stored at that position.
   */
  getElement(row, col) {
    const key = `${row},${col}`;
    return this.elements[key] || 0;
  }

  /**
   * Set a value at a specific position.
   * Removes the value if it is 0.
   */
  setElement(row, col, value) {
    const key = `${row},${col}`;
    if (value === 0) {
      delete this.elements[key];
    } else {
      this.elements[key] = value;
    }
  }

  /**
   * Add this matrix with another sparse matrix.
   * Matrices must have the same dimensions.
   */
  add(other) {
    if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
      throw new Error("Matrix dimensions must match for addition.");
    }

    const result = new SparseMatrix(this.numRows, this.numCols);

    for (const key in this.elements) {
      result.elements[key] = this.elements[key];
    }

    for (const key in other.elements) {
      result.elements[key] = (result.elements[key] || 0) + other.elements[key];
    }

    return result;
  }

  /**
   * Subtract another matrix from this one.
   * Matrices must have the same dimensions.
   */
  subtract(other) {
    if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
      throw new Error("Matrix dimensions must match
