const SparseMatrix = require('./matrix');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Sparse Matrix Operations");
console.log("1. Add");
console.log("2. Subtract");
console.log("3. Multiply");

rl.question("Choose operation (1/2/3): ", (choice) => {
  try {
    const mat1 = SparseMatrix.fromFile('sample_inputs/sample1.txt');
    const mat2 = SparseMatrix.fromFile('sample_inputs/sample2.txt');
    let result;

    if (choice === '1') {
      result = mat1.add(mat2);
    } else if (choice === '2') {
      result = mat1.subtract(mat2);
    } else if (choice === '3') {
      result = mat1.multiply(mat2);
    } else {
      console.log("Invalid choice.");
      rl.close();
      return;
    }

    console.log("Operation successful. Non-zero elements in result:");
    for (const key in result.elements) {
      const value = result.elements[key];
      const [row, col] = key.split(',').map(Number);
      console.log(`(${row}, ${col}, ${value})`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    rl.close();
  }
});
