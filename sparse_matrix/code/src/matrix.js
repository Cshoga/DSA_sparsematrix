// matrix.js
// Defines the SparseMatrix class for reading, storing, and accessing sparse matrices.

const fs = require('fs');

class SparseMatrix {
    constructor(filePath) {
        this.numRows = 0;
        this.numCols = 0;
        this.entries = []; // Array of { row, col, value }

        if (filePath) {
            this.loadFromFile(filePath);
        }
    }

    loadFromFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line !== '');

        if (content.length < 2) {
            throw new Error("Input file has wrong format");
        }

        if (!content[0].startsWith("rows=") || !content[1].startsWith("cols=")) {
            throw new Error("Input file has wrong format");
        }

        this.numRows = parseInt(content[0].split('=')[1]);
        this.numCols = parseInt(content[1].split('=')[1]);

        if (isNaN(this.numRows) || isNaN(this.numCols)) {
            throw new Error("Input file has wrong format");
        }

        for (let i = 2; i < content.length; i++) {
            const line = content[i];

            const match = line.match(/^\((\d+),\s*(\d+),\s*(-?\d+)\)$/);
            if (!match) {
                throw new Error("Input file has wrong format");
            }

            const row = parseInt(match[1]);
            const col = parseInt(match[2]);
            const value = parseInt(match[3]);

            if (value !== 0) {
                this.entries.push({ row, col, value });
            }
        }
    }

    getElement(row, col) {
        for (const entry of this.entries) {
            if (entry.row === row && entry.col === col) {
                return entry.value;
            }
        }
        return 0;
    }

    setElement(row, col, value) {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].row === row && this.entries[i].col === col) {
                if (value === 0) {
                    this.entries.splice(i, 1); // remove
                } else {
                    this.entries[i].value = value;
                }
                return;
            }
        }
        if (value !== 0) {
            this.entries.push({ row, col, value });
        }
    }

    getEntries() {
        return this.entries;
    }
}

module.exports = SparseMatrix;
