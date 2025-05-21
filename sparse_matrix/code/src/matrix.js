#!/usr/bin/env node

const fs = require('fs');

class SparseMatrix {
  constructor(filePathOrRows, cols) {
    this.data = {};     // Store matrix elements as {row: {col: value}}
    this.numRows = 0;
    this.numCols = 0;

    // If first argument is a string, assume it's a filepath and load from file
    if (typeof filePathOrRows === 'string') {
      this.loadFromFile(filePathOrRows);
    } 
    // If first and second arguments are numbers, create empty matrix with those sizes
    else if (typeof filePathOrRows === 'number' && typeof cols === 'number') {
      this.numRows = filePathOrRows;
      this.numCols = cols;
    } else {
      throw new Error('Invalid constructor arguments');
    }
  }

  /**
   * remove leading and trailing spaces or tabs
   * (Because built-in String.trim() might be restricted)
   */
  static trim(str) {
    let start = 0;
    let end = str.length - 1;
    while (start <= end && (str[start] === ' ' || str[start] === '\t')) start++;
    while (end >= start && (str[end] === ' ' || str[end] === '\t')) end--;
    return str.substring(start, end + 1);
  }

  /**
   * Load matrix data from a file.
   * Throws error if file format is invalid.
   */
  loadFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    if (lines.length < 2) {
      throw new Error('Input file has wrong format');
    }

    // Read and parse number of rows and columns
    const rowsLine = SparseMatrix.trim(lines[0]);
    const colsLine = SparseMatrix.trim(lines[1]);

    if (!rowsLine.startsWith('rows=') || !colsLine.startsWith('cols=')) {
      throw new Error('Input file has wrong format');
    }

    this.numRows = parseInt(rowsLine.slice(5));
    this.numCols = parseInt(colsLine.slice(5));

    if (isNaN(this.numRows) || isNaN(this.numCols)) {
      throw new Error('Input file has wrong format');
    }

    // Parse matrix entries from line 3 onward
    for (let i = 2; i < lines.length; i++) {
      const line = SparseMatrix.trim(lines[i]);
      if (line === '') continue; // Ignore empty lines

      // Expect line in format (row, col, value)
      if (line[0] !== '(' || line[line.length - 1] !== ')') {
        throw new Error('Input file has wrong format');
      }

      // Extract string inside parentheses
      const inside = line.substring(1, line.length - 1);

      // Split by comma into 3 parts
      const parts = inside.split(',');
      if (parts.length !== 3) throw new Error('Input file has wrong format');

      // Parse row, col, and value as integers
      const r = parseInt(SparseMatrix.trim(parts[0]));
      const c = parseInt(SparseMatrix.trim(parts[1]));
      const v = parseInt(SparseMatrix.trim(parts[2]));

      // Check for invalid values or out-of-bounds indices
      if (
        isNaN(r) || isNaN(c) || isNaN(v) ||
        r < 0 || r >= this.numRows ||
        c < 0 || c >= this.numCols
      ) {
        throw new Error('Input file has wrong format');
      }

      // Set the matrix element
      this.setElement(r, c, v);
    }
  }

  /**
   * Get element value at (row, col)
   * Returns 0 if no value stored
   */
  getElement(row, col) {
    if (row < 0 || row >= this.numRows || col < 0 || col >= this.numCols) {
      throw new Error('Index out of bounds');
    }
    if (this.data[row] && this.data[row][col] !== undefined) {
      return this.data[row][col];
    }
    return 0;
  }

  /**
   * Set element value at (row, col)
   * Removes element if value = 0 to save space
   */
  setElement(row, col, value) {
    if (row < 0 || row >= this.numRows || col < 0 || col >= this.numCols) {
      throw new Error('Index out of bounds');
    }

    if (value === 0) {
      // Remove element if it exists
      if (this.data[row]) {
        delete this.data[row][col];
        if (Object.keys(this.data[row]).length === 0) {
          delete this.data[row];
        }
      }
    } else {
      // Create row object if missing, then set value
      if (!this.data[row]) this.data[row] = {};
      this.data[row][col] = value;
    }
  }
}

module.exports = SparseMatrix;
