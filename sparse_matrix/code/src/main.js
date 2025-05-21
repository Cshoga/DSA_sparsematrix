#!/usr/bin/env node

const readline = require('readline');
const SparseMatrix = require('./matrix');
const { add, subtract, multiply } = require('./operations');
const fs = require('fs');

// Create readline interface for CLI input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions and get user input as a Promise
function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  try {
    // Print welcome menu
    console.log('Welcome to matrix operations:');
    console.log('1. Addition');
    console.log('2. Subtraction');
    console.log('3. Multiplication');

    // Prompt user to select operation by number
    const choice = await prompt('Choose operation (1/2/3): ');

    // Map user input to operation name
    let operationName;
    if (choice === '1') operationName = 'add';
    else if (choice === '2') operationName = 'subtract';
    else if (choice === '3') operationName = 'multiply';
    else throw new Error('Invalid choice, please enter 1, 2, or 3');

    // Prompt user for input file paths for the two matrices
    const file1 = await prompt('Enter path for first matrix file: ');
    const file2 = await prompt('Enter path for second matrix file: ');

    // Load matrices from files
    const matrixA = new SparseMatrix(file1.trim());
    const matrixB = new SparseMatrix(file2.trim());

    let result;

    // Perform selected operation
    if (operationName === 'add') result = add(matrixA, matrixB);
    else if (operationName === 'subtract') result = subtract(matrixA, matrixB);
    else if (operationName === 'multiply') result = multiply(matrixA, matrixB);

    // Prepare output in required format
    let output = `rows=${result.numRows}\ncols=${result.numCols}\n`;
    for (const row in result.data) {
      for (const col in result.data[row]) {
        output += `(${row}, ${col}, ${result.data[row][col]})\n`;
      }
    }

    // Save output to file
    const outPath = 'result.txt';
    fs.writeFileSync(outPath, output);

    console.log(`Operation successful! Result saved to ${outPath}`);

  } catch (err) {
    // Print error message and exit
    console.error('Error:', err.message);
  } finally {
    // Close readline interface
    rl.close();
  }
})();
