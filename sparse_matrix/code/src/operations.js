// operations.js
// Defines matrix operations: addition, subtraction, multiplication.

const SparseMatrix = require('./matrix');

function addMatrices(A, B) {
    if (A.numRows !== B.numRows || A.numCols !== B.numCols) {
        throw new Error("Matrix size mismatch for addition");
    }

    const result = new SparseMatrix();
    result.numRows = A.numRows;
    result.numCols = A.numCols;

    const map = new Map();

    for (const { row, col, value } of A.getEntries()) {
        map.set(`${row},${col}`, value);
    }

    for (const { row, col, value } of B.getEntries()) {
        const key = `${row},${col}`;
        map.set(key, (map.get(key) || 0) + value);
    }

    for (const [key, value] of map.entries()) {
        if (value !== 0) {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, value);
        }
    }

    return result;
}

function subtractMatrices(A, B) {
    if (A.numRows !== B.numRows || A.numCols !== B.numCols) {
        throw new Error("Matrix size mismatch for subtraction");
    }

    const result = new SparseMatrix();
    result.numRows = A.numRows;
    result.numCols = A.numCols;

    const map = new Map();

    for (const { row, col, value } of A.getEntries()) {
        map.set(`${row},${col}`, value);
    }

    for (const { row, col, value } of B.getEntries()) {
        const key = `${row},${col}`;
        map.set(key, (map.get(key) || 0) - value);
    }

    for (const [key, value] of map.entries()) {
        if (value !== 0) {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, value);
        }
    }

    return result;
}

function multiplyMatrices(A, B) {
    if (A.numCols !== B.numRows) {
        throw new Error("Matrix size mismatch for multiplication");
    }

    const result = new SparseMatrix();
    result.numRows = A.numRows;
    result.numCols = B.numCols;

    const bMap = new Map(); // row → array of (col, val)

    for (const { row, col, value } of B.getEntries()) {
        if (!bMap.has(row)) {
            bMap.set(row, []);
        }
        bMap.get(row).push({ col, value });
    }

    for (const { row: i, col: k, value: aVal } of A.getEntries()) {
        const bRow = bMap.get(k);
        if (bRow) {
            for (const { col: j, value: bVal } of bRow) {
                const current = result.getElement(i, j);
                result.setElement(i, j, current + aVal * bVal);
            }
        }
    }

    return result;
}

module.exports = {
    addMatrices,
    subtractMatrices,
    multiplyMatrices
};
