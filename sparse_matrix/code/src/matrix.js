const fs = require('fs');

/**
 * SparseMatrix class for handling large matrices with mostly zero values.
 * Stores only non-zero elements to save memory.
 */
class SparseMatrix {
    constructor(filePath) {
        this.numRows = 0;
        this.numCols = 0;
        this.elements = {}; // stores non-zero values as: { "row,col": value }

        if (filePath) {
            this.loadFromFile(filePath);
        }
    }

    /**
     * Reads a matrix from a file in the specified format.
     * Example format:
     * rows=5
     * cols=5
     * (0, 1, 10)
     * (2, 3, -5)
     */
    loadFromFile(filePath) {
        try {
            const lines = fs.readFileSync(filePath, 'utf-8')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            // Parse dimensions
            if (!lines[0].startsWith('rows=') || !lines[1].startsWith('cols=')) {
                throw new Error('Input file has wrong format');
            }

            this.numRows = parseInt(lines[0].split('=')[1]);
            this.numCols = parseInt(lines[1].split('=')[1]);

            // Parse matrix values
            for (let i = 2; i < lines.length; i++) {
                const match = lines[i].match(/^\((\d+),\s*(\d+),\s*(-?\d+)\)$/);
                if (!match) throw new Error('Input file has wrong format');

                const [_, r, c, v] = match;
                this.setElement(parseInt(r), parseInt(c), parseInt(v));
            }
        } catch (err) {
            throw new Error('Input file has wrong format');
        }
    }

    /**
     * Returns the value at the given position.
     */
    getElement(row, col) {
        return this.elements[`${row},${col}`] ?? 0;
    }

    /**
     * Sets a value at the given position. Removes the key if the value is zero.
     */
    setElement(row, col, value) {
        const key = `${row},${col}`;
        if (value !== 0) {
            this.elements[key] = value;
        } else {
            delete this.elements[key]; // Don't store zero values
        }
    }

    /**
     * Returns all non-zero entries as an array of { row, col, value }
     */
    getEntries() {
        return Object.entries(this.elements).map(([key, value]) => {
            const [row, col] = key.split(',').map(Number);
            return { row, col, value };
        });
    }
}

module.exports = SparseMatrix;
