# SparseMatrix class is used to represent a large sparse matrix efficiently.
# A sparse matrix is mostly filled with zeros, so we only store the non-zero values.
class SparseMatrix:
    def __init__(self, numRows, numCols):
        # Store the dimensions of the matrix
        self.numRows = numRows
        self.numCols = numCols
        # Dictionary to store non-zero elements: key is (row, col), value is the element
        self.elements = {}

    # This method reads a matrix from a file and returns a SparseMatrix object
    @classmethod
    def from_file(cls, filepath):
        try:
            with open(filepath, 'r') as f:
                rows_line = f.readline().strip()
                cols_line = f.readline().strip()

                # Check that the first lines are correctly formatted
                if not rows_line.startswith("rows=") or not cols_line.startswith("cols="):
                    raise ValueError("Input file has wrong format")

                # Extract the number of rows and columns
                numRows = int(rows_line.split('=')[1])
                numCols = int(cols_line.split('=')[1])

                matrix = cls(numRows, numCols)

                # Read each non-zero element from the file
                for line in f:
                    line = line.strip()
                    if line == '':
                        continue
                    if not (line.startswith('(') and line.endswith(')')):
                        raise ValueError("Input file has wrong format: Bad parenthesis format.")
                    content = line[1:-1]  # remove ( )
                    parts = content.split(',')
                    if len(parts) != 3:
                        raise ValueError("Input file has wrong format: Wrong number of values.")

                    # Convert to integers and store in the matrix
                    r = int(parts[0].strip())
                    c = int(parts[1].strip())
                    val = int(parts[2].strip())

                    matrix.setElement(r, c, val)

            return matrix
        except Exception as e:
            raise e

    # Return the value at a specific row and column (0 if not present)
    def getElement(self, row, col):
        return self.elements.get((row, col), 0)

    # Set a value at a specific row and column
    def setElement(self, row, col, value):
        if value == 0:
            self.elements.pop((row, col), None)  # remove if zero
        else:
            self.elements[(row, col)] = value

    # Matrix Addition: adds two matrices and returns the result
    def add(self, other):
        if self.numRows != other.numRows or self.numCols != other.numCols:
            raise ValueError("Matrix dimensions must be same for addition.")
        result = SparseMatrix(self.numRows, self.numCols)

        # Copy all values from self
        for key, val in self.elements.items():
            result.setElement(key[0], key[1], val)

        # Add values from other
        for key, val in other.elements.items():
            existing = result.getElement(key[0], key[1])
            result.setElement(key[0], key[1], existing + val)

        return result

    # Matrix Subtraction: subtracts the other matrix from this matrix
    def subtract(self, other):
        if self.numRows != other.numRows or self.numCols != other.numCols:
            raise ValueError("Matrix dimensions must be same for subtraction.")
        result = SparseMatrix(self.numRows, self.numCols)

        # Copy all values from self
        for key, val in self.elements.items():
            result.setElement(key[0], key[1], val)

        # Subtract values from other
        for key, val in other.elements.items():
            existing = result.getElement(key[0], key[1])
            result.setElement(key[0], key[1], existing - val)

        return result

    # Matrix Multiplication: multiplies this matrix by another
    def multiply(self, other):
        if self.numCols != other.numRows:
            raise ValueError("Matrix dimensions not compatible for multiplication.")
        result = SparseMatrix(self.numRows, other.numCols)

        # Only multiply where elements are non-zero
        for (i, k), val1 in self.elements.items():
            for j in range(other.numCols):
                val2 = other.getElement(k, j)
                if val2 != 0:
                    existing = result.getElement(i, j)
                    result.setElement(i, j, existing + val1 * val2)

        return result

# Main program to allow user to select the operation
def main():
    print("Welcome to Sparse Matrix Operations")
    print("1. Addition")
    print("2. Subtraction")
    print("3. Multiplication")
    choice = input("Choose operation (1/2/3): ").strip()

    try:
        # Load both matrices from the input files
        mat1 = SparseMatrix.from_file("sample_inputs/sample1.txt")
        mat2 = SparseMatrix.from_file("sample_inputs/sample2.txt")

        # Perform selected operation
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

# Run the program
if __name__ == "__main__":
    main()
