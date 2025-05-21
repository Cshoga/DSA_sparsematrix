const readline = require('readline');
const fs = require('fs');
const SparseMatrix = require('./SparseMatrix');
const { addMatrices, subtractMatrices, multiplyMatrices } = require('./operations');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility to simplify user input
function prompt(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    try {
        console.log('\n🧮 Sparse Matrix Operations');
        const operation = await prompt('Choose operation (add, subtract, multiply): ');
        const pathA = await prompt('Enter path to Matrix A file: ');
        const pathB = await prompt('Enter path to Matrix B file: ');

        const A = new SparseMatrix(pathA.trim());
        const B = new SparseMatrix(pathB.trim());

        let result;

        if (operation === 'add') {
            result = addMatrices(A, B);
        } else if (operation === 'subtract') {
            result = subtractMatrices(A, B);
        } else if (operation === 'multiply') {
            result = multiplyMatrices(A, B);
        } else {
            console.log('❌ Invalid operation selected.');
            rl.close();
            return;
        }

        const outputPath = await prompt('Enter output file path to save result: ');
        const lines = [`rows=${result.numRows}`, `cols=${result.numCols}`];
        for (const { row, col, value } of result.getEntries()) {
            lines.push(`(${row}, ${col}, ${value})`);
        }

        fs.writeFileSync(outputPath.trim(), lines.join('\n'));
        console.log(`✅ Operation completed. Result saved to: ${outputPath}`);

    } catch (err) {
        console.error('❗ Error:', err.message);
    } finally {
        rl.close();
    }
}

main();
