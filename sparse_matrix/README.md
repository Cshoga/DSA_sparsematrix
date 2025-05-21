# Sparse Matrix Operations

This project implements basic operations on sparse matrices:
- Addition
- Subtraction
- Multiplication

---

## How It Works

- Reads two sparse matrices from text files in `sample_inputs/`.
- Performs the selected operation.
- Saves the result to `sample_inputs/output.txt`.

---

## Matrix File Format

rows=3
cols=3
(0, 1, 5)
(2, 0, -3)

- First line: number of rows  
- Second line: number of columns  
- Following lines: `(row, col, value)` for non-zero entries only.

---

## How to Run

1. Open terminal in `code/src/` folder.  
2. Run the program:

3. Follow the prompt to choose operation (`add`, `subtract`, or `multiply`).

---

## Notes

- The program checks for invalid file formats.  
- Matrix dimensions must be compatible for the chosen operation.

---

## Project Structure

/code/src/ - Source code
/sample_inputs/ - Input and output files

yaml
Copy
Edit

---

Made for Data Structures and Algorithms course.  
Happy coding! 😊
