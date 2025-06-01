def train_model(model, X_train, y_train):
    """
    Trains the given model using the training data.

    Parameters:
    model: The machine learning model to be trained.
    X_train: The features of the training dataset.
    y_train: The target variable of the training dataset.

    Returns:
    model: The trained model.
    """
    model.fit(X_train, y_train)
    return model

def save_model(model, filename):
    """
    Saves the trained model to a file.

    Parameters:
    model: The trained machine learning model.
    filename: The name of the file where the model will be saved.
    """
    import joblib
    joblib.dump(model, filename)

def load_model(filename):
    """
    Loads a trained model from a file.

    Parameters:
    filename: The name of the file from which the model will be loaded.

    Returns:
    model: The loaded machine learning model.
    """
    import joblib
    return joblib.load(filename)