class SparseMatrix:
    def __init__(self, numRows, numCols):
        self.numRows = numRows
        self.numCols = numCols
        self.elements = {}

    @classmethod
    def from_file(cls, filepath):
        try:
            with open(filepath, 'r') as f:
                rows_line = f.readline().strip()
                cols_line = f.readline().strip()

                if not rows_line.startswith("rows=") or not cols_line.startswith("cols="):
                    raise ValueError("Input file has wrong format")

                numRows = int(rows_line.split('=')[1])
                numCols = int(cols_line.split('=')[1])

                matrix = cls(numRows, numCols)

                for line in f:
                    line = line.strip()
                    if line == '':
                        continue
                    if not (line.startswith('(') and line.endswith(')')):
                        raise ValueError("Input file has wrong format: Bad parenthesis format.")
                    content = line[1:-1]  # remove parentheses
                    parts = content.split(',')
                    if len(parts) != 3:
                        raise ValueError("Input file has wrong format: Wrong number of values.")
                    r, c, val = parts
                    r = int(r.strip())
                    c = int(c.strip())
                    val = int(val.strip())

                    matrix.setElement(r, c, val)

            return matrix
        except Exception as e:
            raise e

    def getElement(self, row, col):
        return self.elements.get((row, col), 0)

    def setElement(self, row, col, value):
        if value == 0:
            self.elements.pop((row, col), None)
        else:
            self.elements[(row, col)] = value

    def add(self, other):
        if self.numRows != other.numRows or self.numCols != other.numCols:
            raise ValueError("Matrix dimensions must be same for addition.")
        result = SparseMatrix(self.numRows, self.numCols)
        # Add all elements of self
        for key, val in self.elements.items():
            result.setElement(key[0], key[1], val)
        # Add all elements of other
        for key, val in other.elements.items():
            existing = result.getElement(key[0], key[1])
            result.setElement(key[0], key[1], existing + val)
        return result

    def subtract(self, other):
        if self.numRows != other.numRows or self.numCols != other.numCols:
            raise ValueError("Matrix dimensions must be same for subtraction.")
        result = SparseMatrix(self.numRows, self.numCols)
        for key, val in self.elements.items():
            result.setElement(key[0], key[1], val)
        for key, val in other.elements.items():
            existing = result.getElement(key[0], key[1])
            result.setElement(key[0], key[1], existing - val)
        return result

    def multiply(self, other):
        if self.numCols != other.numRows:
            raise ValueError("Matrix dimensions not compatible for multiplication.")
        result = SparseMatrix(self.numRows, other.numCols)

        # Multiply only non-zero entries
        for (i, k), val1 in self.elements.items():
            for j in range(other.numCols):
                val2 = other.getElement(k, j)
                if val2 != 0:
                    existing = result.getElement(i, j)
                    result.setElement(i, j, existing + val1 * val2)
        return result


def main():
    print("Welcome to Sparse Matrix Operations")
    print("1. Addition")
    print("2. Subtraction")
    print("3. Multiplication")
    choice = input("Choose operation (1/2/3): ").strip()

    try:
        mat1 = SparseMatrix.from_file("sample_inputs/sample1.txt")
        mat2 = SparseMatrix.from_file("sample_inputs/sample2.txt")

        if choice == '1':
            result = mat1.add(mat2)
        elif choice == '2':
            result = mat1.subtract(mat2)
        elif choice == '3':
            result = mat1.multiply(mat2)
        else:
            print("Invalid choice.")
            return

        print(f"Operation completed. Result has {len(result.elements)} non-zero entries.")

    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
