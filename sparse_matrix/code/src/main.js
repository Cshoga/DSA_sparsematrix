const readline = require('readline');
const { SparseMatrix } = require('./matrix');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

async function main() {
  try {
    console.log("Sparse Matrix Operations");
    console.log("1. Addition");
    console.log("2. Subtraction");
    console.log("3. Multiplication");

    const choice = await ask("Choose operation (1/2/3): ");
    const file1 = await ask("Enter path for Matrix A (e.g. sample_inputs/sample1.txt): ");
    const file2 = await ask("Enter path for Matrix B (e.g. sample_inputs/sample2.txt): ");

    const mat1 = SparseMatrix.fromFile(file1);
    const mat2 = SparseMatrix.fromFile(file2);

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

    console.log(`✅ Operation complete. Result has ${result.countNonZero()} non-zero entries.`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    rl.close();
  }
}

main();
