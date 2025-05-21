/**
 * Adds two sparse matrices.
 */
function addMatrices(A, B) {
    if (A.numRows !== B.numRows || A.numCols !== B.numCols) {
        throw new Error('Matrices must have the same dimensions for addition');
    }

    const result = new A.constructor();
    result.numRows = A.numRows;
    result.numCols = A.numCols;

    for (const { row, col, value } of A.getEntries()) {
        result.setElement(row, col, value);
    }

    for (const { row, col, value } of B.getEntries()) {
        const sum = result.getElement(row, col) + value;
        result.setElement(row, col, sum);
    }

    return result;
}

/**
 * Subtracts matrix B from matrix A.
 */
function subtractMatrices(A, B) {
    if (A.numRows !== B.numRows || A.numCols !== B.numCols) {
        throw new Error('Matrices must have the same dimensions for subtraction');
    }

    const result = new A.constructor();
    result.numRows = A.numRows;
    result.numCols = A.numCols;

    for (const { row, col, value } of A.getEntries()) {
        result.setElement(row, col, value);
    }

    for (const { row, col, value } of B.getEntries()) {
        const diff = result.getElement(row, col) - value;
        result.setElement(row, col, diff);
    }

    return result;
}

/**
 * Multiplies two sparse matrices.
 */
function multiplyMatrices(A, B) {
    if (A.numCols !== B.numRows) {
        throw new Error('Incompatible dimensions for multiplication');
    }

    const result = new A.constructor();
    result.numRows = A.numRows;
    result.numCols = B.numCols;

    // Group B's values by row for faster access
    const B_by_row = {};
    for (const { row, col, value } of B.getEntries()) {
        if (!B_by_row[row]) B_by_row[row] = [];
        B_by_row[row].push({ col, value });
    }

    for (const { row: i, col: k, value: aVal } of A.getEntries()) {
        const rowB = B_by_row[k] || [];
        for (const { col: j, value: bVal } of rowB) {
            const oldVal = result.getElement(i, j);
            result.setElement(i, j, oldVal + aVal * bVal);
        }
    }

    return result;
}

module.exports = { addMatrices, subtractMatrices, multiplyMatrices };
