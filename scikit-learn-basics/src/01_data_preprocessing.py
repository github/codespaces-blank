import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

def load_data(filepath):
    # Load data from a CSV file
    data = pd.read_csv(filepath)
    return data

def handle_missing_values(data, strategy='mean'):
    # Handle missing values using the specified strategy
    imputer = SimpleImputer(strategy=strategy)
    data_imputed = imputer.fit_transform(data)
    return pd.DataFrame(data_imputed, columns=data.columns)

def encode_categorical_variables(data):
    # Identify categorical columns
    categorical_cols = data.select_dtypes(include=['object']).columns
    if len(categorical_cols) == 0:
        return data
    # One-hot encode categorical variables
    encoder = OneHotEncoder(sparse=False)
    encoded_data = encoder.fit_transform(data[categorical_cols])
    # Create a DataFrame with the encoded variables
    encoded_df = pd.DataFrame(encoded_data, columns=encoder.get_feature_names_out(categorical_cols))
    # Drop original categorical columns and concatenate with encoded DataFrame
    data = data.drop(categorical_cols, axis=1)
    data = pd.concat([data.reset_index(drop=True), encoded_df.reset_index(drop=True)], axis=1)
    return data

def scale_features(data):
    # Scale features to have zero mean and unit variance
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)
    return pd.DataFrame(scaled_data, columns=data.columns)

if __name__ == "__main__":
    # 1. Load the data
    df = load_data('AI/scikit-learn-basics/src/data/iris.csv')
    print("Original Data:")
    print(df.head())

    # 2. Separate features and target
    X = df.drop('target', axis=1)
    y = df['target']

    # 3. Handle missing values (if any)
    X = handle_missing_values(X)

    # 4. Encode categorical variables (if any)
    X = encode_categorical_variables(X)

    # 5. Scale features
    X = scale_features(X)

    print("\nPreprocessed Features:")
    print(X.head())
    print("\nTarget:")
    print(y.head())