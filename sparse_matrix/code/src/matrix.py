const fs = require('fs');

class Entry {
    constructor(r, c, val) {
        this.row = r;
        this.col = c;
        this.val = val;
    }
}

class SparseMatrix {
    constructor(rows, cols) {
        this.numRows = rows;
        this.numCols = cols;
        this.data = []; // stores Entry objects
    }

    static fromFile(filePath) {
        try {
            const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
            let rows = 0, cols = 0;
            let matrix = null;

            for (let line of lines) {
                line = line.trim();
                if (line === '') continue;

                if (line.startsWith('rows=')) {
                    rows = parseInt(line.split('=')[1]);
                } else if (line.startsWith('cols=')) {
                    cols = parseInt(line.split('=')[1]);
                    matrix = new SparseMatrix(rows, cols);
                } else {
                    // Parse the entry like (3, 4, 9)
                    if (!line.startsWith('(') || !line.endsWith(')')) {
                        throw new Error("Input file has wrong format");
                    }
                    const parts = line.slice(1, -1).split(',');
                    if (parts.length !== 3) throw new Error("Input file has wrong format");

                    const r = parseInt(parts[0]);
                    const c = parseInt(parts[1]);
                    const v = parseInt(parts[2]);

                    if (isNaN(r) || isNaN(c) || isNaN(v)) {
                        throw new Error("Input file has wrong format");
                    }

                    matrix.addData(r, c, v);
                }
            }

            return matrix;
        } catch (err) {
            throw new Error("Failed to read matrix: " + err.message);
        }
    }

    addData(row, col, val) {
        if (row >= this.numRows || col >= this.numCols) return;
        this.data.push(new Entry(row, col, val));
    }

    getAt(row, col) {
        for (let entry of this.data) {
            if (entry.row === row && entry.col === col) {
                return entry.val;
            }
        }
        return 0;
    }

    addMatrix(other) {
        if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
            throw new Error("Matrix dimensions must match for addition");
        }

        let result = new SparseMatrix(this.numRows, this.numCols);
        let allEntries = {};

        for (let entry of this.data) {
            let key = `${entry.row},${entry.col}`;
            allEntries[key] = entry.val;
        }

        for (let entry of other.data) {
            let key = `${entry.row},${entry.col}`;
            if (key in allEntries) {
                allEntries[key] += entry.val;
            } else {
                allEntries[key] = entry.val;
            }
        }

        for (let key in allEntries) {
            let [r, c] = key.split(',').map(Number);
            let v = allEntries[key];
            if (v !== 0) result.addData(r, c, v);
        }

        return result;
    }

    subtractMatrix(other) {
        let negated = new SparseMatrix(other.numRows, other.numCols);
        for (let e of other.data) {
            negated.addData(e.row, e.col, -e.val);
        }
        return this.addMatrix(negated);
    }

    multiplyMatrix(other) {
        if (this.numCols !== other.numRows) {
            throw new Error("Matrix dimensions not compatible for multiplication");
        }

        let result = new SparseMatrix(this.numRows, other.numCols);

        for (let a of this.data) {
            for (let b of other.data) {
                if (a.col === b.row) {
                    let prev = result.getAt(a.row, b.col);
                    result.setAt(a.row, b.col, prev + a.val * b.val);
                }
            }
        }

        return result;
    }

    setAt(row, col, value) {
        if (value === 0) return;
        for (let entry of this.data) {
            if (entry.row === row && entry.col === col) {
                entry.val = value;
                return;
            }
        }
        this.data.push(new Entry(row, col, value));
    }

    showStuff() {
        console.log(`rows=${this.numRows}`);
        console.log(`cols=${this.numCols}`);
        for (let e of this.data) {
            console.log(`(${e.row}, ${e.col}, ${e.val})`);
        }
    }
}

// Example menu
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function Menu() {
    console.log("Choose an operation:");
    console.log("1. Add");
    console.log("2. Subtract");
    console.log("3. Multiply");

    readline.question("Enter your choice (1/2/3): ", (choice) => {
        const path1 = "../../sample_inputs/matrix1.txt";
        const path2 = "../../sample_inputs/matrix2.txt";

        let m1 = SparseMatrix.fromFile(path1);
        let m2 = SparseMatrix.fromFile(path2);
        let result = null;

        try {
            if (choice === '1') result = m1.addMatrix(m2);
            else if (choice === '2') result = m1.subtractMatrix(m2);
            else if (choice === '3') result = m1.multiplyMatrix(m2);
            else console.log("Invalid option");

            if (result) {
                console.log("\nResult Matrix:");
                result.showStuff();
            }
        } catch (e) {
            console.error("Something went wrong: " + e.message);
        } finally {
            readline.close();
        }
    });
}

Menu();
