# scikit-learn Basics

This project is designed to help you learn the basic and core principles of scikit-learn through practical implementation. It covers data preprocessing, model selection, training, and evaluation, providing a comprehensive understanding of the machine learning workflow.

## Project Structure

```
scikit-learn-basics
├── src
│   ├── 01_data_preprocessing.py
│   ├── 02_model_selection.py
│   ├── 03_training.py
│   ├── 04_evaluation.py
│   └── utils
│       └── data_loader.py
├── requirements.txt
└── README.md
```

## Installation

To get started, clone this repository and install the required dependencies. You can do this by running:

```bash
git clone <repository-url>
cd scikit-learn-basics
pip install -r requirements.txt
```

## Usage

1. **Data Preprocessing**: Start by loading and preprocessing your dataset using the functions defined in `src/01_data_preprocessing.py`. This includes handling missing values, encoding categorical variables, and scaling features.

2. **Model Selection**: Use `src/02_model_selection.py` to split your dataset into training and testing sets. This file also contains functions for selecting the appropriate model and performing hyperparameter tuning.

3. **Training**: Train your selected model on the training dataset by utilizing the functions in `src/03_training.py`. This will fit the model and save it for future use.

4. **Evaluation**: Finally, evaluate the performance of your trained model on the test dataset using `src/04_evaluation.py`. This file provides functions to calculate various performance metrics such as accuracy, precision, recall, and F1 score.

## Learning Objectives

By working through this project, you will gain hands-on experience with:

- Data preprocessing techniques
- Model selection and hyperparameter tuning
- Training machine learning models
- Evaluating model performance

Feel free to explore the code and modify it to suit your learning needs. Happy coding!