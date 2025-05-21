class InvalidFormatError(Exception):
    pass

class SparseMatrix:
    def __init__(self, num_rows, num_cols):
        self.rows = num_rows
        self.cols = num_cols
        self.elements = {}  # {(row, col): value}

    @classmethod
    def from_file(cls, file_path):
        try:
            with open(file_path, 'r') as f:
                lines = [line.strip() for line in f if line.strip()]

            if not lines[0].startswith("rows=") or not lines[1].startswith("cols="):
                raise InvalidFormatError("Missing rows or cols header.")

            rows = int(lines[0].split('=')[1])
            cols = int(lines[1].split('=')[1])

            matrix = cls(rows, cols)

            for line in lines[2:]:
                if not (line.startswith("(") and line.endswith(")")):
                    raise InvalidFormatError("Bad parenthesis format.")

                parts = line[1:-1].split(',')
                if len(parts) != 3:
                    raise InvalidFormatError("Each entry must have 3 values.")

                try:
                    r, c, v = int(parts[0]), int(parts[1]), int(parts[2])
                except ValueError:
                    raise InvalidFormatError("Non-integer value found.")

                matrix.set_element(r, c, v)

            return matrix

        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")
        except InvalidFormatError as e:
            raise ValueError(f"Input file has wrong format: {e}")

    def set_element(self, row, col, value):
        if value != 0:
            self.elements[(row, col)] = value

    def get_element(self, row, col):
        return self.elements.get((row, col), 0)

    def __str__(self):
        return f"SparseMatrix({self.rows}x{self.cols}, {len(self.elements)} elements)"

    def add(self, other):
        if self.rows != other.rows or self.cols != other.cols:
            raise ValueError("Matrix dimensions do not match for addition.")

        result = SparseMatrix(self.rows, self.cols)
        keys = set(self.elements.keys()).union(other.elements.keys())
        for key in keys:
            result.set_element(key[0], key[1], self.get_element(*key) + other.get_element(*key))
        return result

    def subtract(self, other):
        if self.rows != other.rows or self.cols != other.cols:
            raise ValueError("Matrix dimensions do not match for subtraction.")

        result = SparseMatrix(self.rows, self.cols)
        keys = set(self.elements.keys()).union(other.elements.keys())
        for key in keys:
            result.set_element(key[0], key[1], self.get_element(*key) - other.get_element(*key))
        return result

    def multiply(self, other):
        if self.cols != other.rows:
            raise ValueError("Matrix dimensions do not allow multiplication.")

        result = SparseMatrix(self.rows, other.cols)

        for (i, k1), v1 in self.elements.items():
            for j in range(other.cols):
                v2 = other.get_element(k1, j)
                if v2 != 0:
                    old = result.get_element(i, j)
                    result.set_element(i, j, old + v1 * v2)
        return result
