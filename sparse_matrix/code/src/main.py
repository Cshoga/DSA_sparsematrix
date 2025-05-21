from matrix import SparseMatrix

def main():
print("Welcome to Sparse Matrix Operations")
print("1. Addition")
print("2. Subtraction")
print("3. Multiplication")

choice = input("Choose operation (1/2/3): ").strip()

try:
mat1 = SparseMatrix.from_file("/dsa/sparse_matrix/sample_inputs/sample1.txt")
mat2 = SparseMatrix.from_file("/dsa/sparse_matrix/sample_inputs/sample2.txt")


if choice == '1':
result = mat1.add(mat2)
elif choice == '2':
result = mat1.subtract(mat2)
elif choice == '3':
result = mat1.multiply(mat2)
else:
print("Invalid choice.")
return

print("Operation completed. Result has", len(result.elements), "non-zero entries.")

except Exception as e:
print("Error:", e)

if __name__ == "__main__":
main()
