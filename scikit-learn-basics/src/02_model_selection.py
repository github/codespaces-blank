from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score

def split_data(X, y, test_size=0.2, random_state=None):
    """
    Splits the dataset into training and testing sets.

    Parameters:
    X (array-like): Features dataset.
    y (array-like): Target dataset.
    test_size (float): Proportion of the dataset to include in the test split.
    random_state (int): Random seed for reproducibility.

    Returns:
    X_train, X_test, y_train, y_test: Split datasets.
    """
    return train_test_split(X, y, test_size=test_size, random_state=random_state)

def model_selection(X_train, y_train, model, param_grid, cv=5):
    """
    Selects the best model using GridSearchCV.

    Parameters:
    X_train (array-like): Training features dataset.
    y_train (array-like): Training target dataset.
    model: The model to be tuned.
    param_grid (dict): Dictionary with parameters names (str) as keys and lists of parameter settings to try as values.
    cv (int): Number of cross-validation folds.

    Returns:
    best_model: The model with the best parameters.
    """
    grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=cv)
    grid_search.fit(X_train, y_train)
    return grid_search.best_estimator_

def evaluate_model(model, X_test, y_test):
    """
    Evaluates the model on the test dataset.

    Parameters:
    model: The trained model to evaluate.
    X_test (array-like): Test features dataset.
    y_test (array-like): Test target dataset.

    Returns:
    accuracy (float): Accuracy of the model on the test dataset.
    """
    y_pred = model.predict(X_test)
    return accuracy_score(y_test, y_pred)