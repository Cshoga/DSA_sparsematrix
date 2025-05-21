const readline = require('readline');
const fs = require('fs');
const path = require('path');

const SparseMatrix = require('./matrix');
const { addMatrices, subtractMatrices, multiplyMatrices } = require('./operations');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    try {
        console.log('Sparse Matrix user-friendly opreations\n');

        const operation = await prompt('Choose operation (add, subtract, multiply): ');

        // Automatically find the paths relative to the project root
        const rootDir = path.resolve(__dirname, '../../');
        const input1Path = path.join(rootDir, 'sample_inputs', 'sampl1.txt');
        const input2Path = path.join(rootDir, 'sample_inputs', 'sample2.txt');
        const outputPath = path.join(rootDir, 'sample_inputs', 'output.txt');

        const A = new SparseMatrix(input1Path);
        const B = new SparseMatrix(input2Path);

        let result;

        switch (operation.toLowerCase()) {
            case 'add':
                result = addMatrices(A, B);
                break;
            case 'subtract':
                result = subtractMatrices(A, B);
                break;
            case 'multiply':
                result = multiplyMatrices(A, B);
                break;
            default:
                console.log('Invalid operation.');
                rl.close();
                return;
        }

        const outputLines = [`rows=${result.numRows}`, `cols=${result.numCols}`];
        for (const { row, col, value } of result.getEntries()) {
            outputLines.push(`(${row}, ${col}, ${value})`);
        }

        fs.writeFileSync(outputPath, outputLines.join('\n'));
        console.log(`well Done! Output saved to: ${outputPath}`);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        rl.close();
    }
}

main();
