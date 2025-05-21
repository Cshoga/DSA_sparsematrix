// Import the built-in file system module
const fs = require('fs');

// Define the SparseMatrix class
class SparseMatrix {
  constructor(numRows, numCols) {
    this.numRows = numRows;     // Total number of rows in the matrix
    this.numCols = numCols;     // Total number of columns
    this.elements = {};         // Store only non-zero elements as key-value pairs: "row,col": value
  }

  // Static method to create a matrix from a text file
  static fromFile(filePath) {
    try {
      // Read and prepare file lines
      const lines = fs.readFileSync(filePath, 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Validate the first two lines for row and column count
      if (!lines[0].startsWith('rows=') || !lines[1].startsWith('cols=')) {
        throw new Error('Input file has wrong format: Missing row/col definition.');
      }

      const numRows = parseInt(lines[0].split('=')[1]);
      const numCols = parseInt(lines[1].split('=')[1]);

      // Create a new sparse matrix
      const matrix = new SparseMatrix(numRows, numCols);

      // Parse each matrix element line
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i];

        // Each line must be like (row, col, value)
        if (!line.startsWith('(') || !line.endsWith(')')) {
          throw new Error('Input file has wrong format: Bad parenthesis format.');
        }

        // Remove parentheses and split values
        const content = line.slice(1, -1);
        const parts = content.split(',');

        if (parts.length !== 3) {
          throw new Error('Input file has wrong format: Must have 3 values per entry.');
        }

        // Convert strings to integers
        const row = parseInt(parts[0].trim());
        const col = parseInt(parts[1].trim());
        const val = parseInt(parts[2].trim());

        if (isNaN(row) || isNaN(col) || isNaN(val)) {
          throw new Error('Input file has wrong format: Non-integer value found.');
        }

        // Add element to the matrix
        matrix.setElement(row, col, val);
      }

      return matrix;

    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Get the value at (row, col), return 0 if not present
  getElement(row, col) {
    return this.elements[`${row},${col}`] || 0;
  }

  // Set the value at (row, col); remove if value is 0
  setElement(row, col, value) {
    const key = `${row},${col}`;
    if (value === 0) {
      delete this.elements[key];
    } else {
      this.elements[key] = value;
    }
  }

  // Add another sparse matrix to this one
  add(other) {
    if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
      throw new Error("Matrix dimensions must match for addition.");
    }

    const result = new SparseMatrix(this.numRows, this.numCols);

    // Copy current matrix elements
    for (const key in this.elements) {
      result.elements[key] = this.elements[key];
    }

    // Add elements from the other matrix
    for (const key in other.elements) {
      const [row, col] = key.split(',').map(Number);
      const sum = result.getElement(row, col) + other.getElement(row, col);
      result.setElement(row, col, sum);
    }

    return result;
  }

  // Subtract another sparse matrix from this one
  subtract(other) {
    if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
      throw new Error("Matrix dimensions must match for subtraction.");
    }

    const result = new SparseMatrix(this.numRows, this.numCols);

    // Copy current matrix elements
    for (const key in this.elements) {
      result.elements[key] = this.elements[key];
    }

    // Subtract the other matrix elements
    for (const key in other.elements) {
      const [row, col] = key.split(',').map(Number);
      const diff = result.getElement(row, col) - other.getElement(row, col);
      result.setElement(row, col, diff);
    }

    return result;
  }

  // Multiply this matrix with another
  multiply(other) {
    if (this.numCols !== other.numRows) {
      throw new Error("Matrix dimensions not compatible for multiplication.");
    }

    const result = new SparseMatrix(this.numRows, other.numCols);

    // Multiply only the non-zero values
    for (const keyA in this.elements) {
      const [rowA, colA] = keyA.split(',').map(Number);
      const valA = this.elements[keyA];

      for (let colB = 0; colB < other.numCols; colB++) {
        const valB = other.getElement(colA, colB);
        if (valB !== 0) {
          const existing = result.getElement(rowA, colB);
          result.setElement(rowA, colB, existing + valA * valB);
        }
      }
    }

    return result;
  }

  // Count how many non-zero entries the matrix has
  countNonZero() {
    return Object.keys(this.elements).length;
  }
}

// Export the SparseMatrix class for use in other files
module.exports = { SparseMatrix };
