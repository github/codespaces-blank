from sklearn.datasets import load_iris
import pandas as pd

# Load Iris dataset
iris = load_iris(as_frame=True)
df = iris.frame

# Save to CSV
df.to_csv("iris.csv", index=False)
print("Iris dataset saved to ../data/iris.csv")