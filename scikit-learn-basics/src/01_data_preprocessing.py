def load_data(filepath):
    import pandas as pd
    # Load data from a CSV file
    data = pd.read_csv(filepath)
    return data

def handle_missing_values(data, strategy='mean'):
    from sklearn.impute import SimpleImputer
    # Handle missing values using the specified strategy
    imputer = SimpleImputer(strategy=strategy)
    data_imputed = imputer.fit_transform(data)
    return data_imputed

def encode_categorical_variables(data):
    from sklearn.preprocessing import OneHotEncoder
    # Identify categorical columns
    categorical_cols = data.select_dtypes(include=['object']).columns
    # One-hot encode categorical variables
    encoder = OneHotEncoder(sparse=False)
    encoded_data = encoder.fit_transform(data[categorical_cols])
    # Create a DataFrame with the encoded variables
    encoded_df = pd.DataFrame(encoded_data, columns=encoder.get_feature_names_out(categorical_cols))
    # Drop original categorical columns and concatenate with encoded DataFrame
    data = data.drop(categorical_cols, axis=1)
    data = pd.concat([data, encoded_df], axis=1)
    return data

def scale_features(data):
    from sklearn.preprocessing import StandardScaler
    # Scale features to have zero mean and unit variance
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)
    return scaled_data