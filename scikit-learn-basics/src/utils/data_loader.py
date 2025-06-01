def load_csv(file_path):
    import pandas as pd
    """Load a CSV file into a DataFrame."""
    return pd.read_csv(file_path)

def load_excel(file_path):
    import pandas as pd
    """Load an Excel file into a DataFrame."""
    return pd.read_excel(file_path)

def load_json(file_path):
    import pandas as pd
    """Load a JSON file into a DataFrame."""
    return pd.read_json(file_path)

def load_data(source, file_path):
    """Load data from various sources based on the file type."""
    if source == 'csv':
        return load_csv(file_path)
    elif source == 'excel':
        return load_excel(file_path)
    elif source == 'json':
        return load_json(file_path)
    else:
        raise ValueError("Unsupported data source. Please use 'csv', 'excel', or 'json'.")