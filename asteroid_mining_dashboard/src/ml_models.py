#!/usr/bin/env python3
"""
AI-Driven Asteroid Mining Resource Classification Dashboard
Team: Bharatiya Antariksh Khani

Machine Learning models for asteroid mining potential classification.
Implements Random Forest and Gradient Boosting ensemble models.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.pipeline import Pipeline
import joblib
import logging
from pathlib import Path
from typing import Tuple, Dict, List
import matplotlib.pyplot as plt
import seaborn as sns

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AsteroidMiningClassifier:
    """
    Ensemble classifier for asteroid mining potential assessment
    """
    
    def __init__(self, models_dir: str = "models"):
        self.models_dir = Path(models_dir)
        self.models_dir.mkdir(exist_ok=True)
        
        # Initialize models
        self.rf_model = None
        self.gb_model = None
        self.ensemble_model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        
        # Feature importance tracking
        self.feature_importance = {}
        self.feature_names = []
        
    def prepare_features(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare features for machine learning models
        
        Args:
            df: DataFrame with asteroid data
            
        Returns:
            Tuple of (features, labels)
        """
        # Select relevant features for mining classification
        feature_columns = [
            'diameter_km', 'albedo', 'absolute_magnitude',
            'semi_major_axis', 'eccentricity', 'inclination',
            'periapsis_distance', 'apoapsis_distance', 'earth_moid',
            'delta_v_estimate', 'accessibility_score',
            'orbit_class_mining_score', 'size_mining_score', 'composition_score'
        ]
        
        # Numeric features
        numeric_features = df[feature_columns].copy()
        
        # Handle missing values
        numeric_features = numeric_features.fillna(numeric_features.median())
        
        # Add categorical features
        orbit_class_encoded = pd.get_dummies(df['orbit_class_code'].fillna('UNK'), prefix='orbit')
        features_df = pd.concat([numeric_features, orbit_class_encoded], axis=1)
        
        # Store feature names
        self.feature_names = features_df.columns.tolist()
        
        # Convert to numpy arrays
        X = features_df.values
        
        # Create mining potential labels based on combined score
        y = self._create_mining_labels(df['combined_mining_score'].fillna(0.5))
        
        return X, y
    
    def _create_mining_labels(self, scores: pd.Series) -> np.ndarray:
        """
        Create categorical labels from mining scores
        
        Args:
            scores: Series of combined mining scores
            
        Returns:
            Array of categorical labels
        """
        labels = []
        for score in scores:
            if score >= 0.8:
                labels.append('High')
            elif score >= 0.6:
                labels.append('Medium')
            elif score >= 0.4:
                labels.append('Low')
            else:
                labels.append('Very Low')
        
        return np.array(labels)
    
    def train_models(self, df: pd.DataFrame, test_size: float = 0.2) -> Dict:
        """
        Train ensemble models for mining classification
        
        Args:
            df: Training dataset
            test_size: Fraction of data for testing
            
        Returns:
            Dictionary with training results
        """
        logger.info("Preparing features for training...")
        X, y = self.prepare_features(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Encode labels
        y_train_encoded = self.label_encoder.fit_transform(y_train)
        y_test_encoded = self.label_encoder.transform(y_test)
        
        results = {}
        
        # Train Random Forest
        logger.info("Training Random Forest model...")
        self.rf_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        self.rf_model.fit(X_train_scaled, y_train_encoded)
        rf_pred = self.rf_model.predict(X_test_scaled)
        rf_accuracy = accuracy_score(y_test_encoded, rf_pred)
        
        results['random_forest'] = {
            'accuracy': rf_accuracy,
            'predictions': self.label_encoder.inverse_transform(rf_pred),
            'true_labels': y_test
        }
        
        # Train Gradient Boosting
        logger.info("Training Gradient Boosting model...")
        self.gb_model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        
        self.gb_model.fit(X_train_scaled, y_train_encoded)
        gb_pred = self.gb_model.predict(X_test_scaled)
        gb_accuracy = accuracy_score(y_test_encoded, gb_pred)
        
        results['gradient_boosting'] = {
            'accuracy': gb_accuracy,
            'predictions': self.label_encoder.inverse_transform(gb_pred),
            'true_labels': y_test
        }
        
        # Create ensemble predictions
        rf_proba = self.rf_model.predict_proba(X_test_scaled)
        gb_proba = self.gb_model.predict_proba(X_test_scaled)
        ensemble_proba = (rf_proba + gb_proba) / 2
        ensemble_pred = np.argmax(ensemble_proba, axis=1)
        ensemble_accuracy = accuracy_score(y_test_encoded, ensemble_pred)
        
        results['ensemble'] = {
            'accuracy': ensemble_accuracy,
            'predictions': self.label_encoder.inverse_transform(ensemble_pred),
            'true_labels': y_test,
            'probabilities': ensemble_proba
        }
        
        # Store feature importance
        self.feature_importance['random_forest'] = dict(
            zip(self.feature_names, self.rf_model.feature_importances_)
        )
        self.feature_importance['gradient_boosting'] = dict(
            zip(self.feature_names, self.gb_model.feature_importances_)
        )
        
        # Save models
        self.save_models()
        
        logger.info(f"Training completed:")
        logger.info(f"  Random Forest Accuracy: {rf_accuracy:.3f}")
        logger.info(f"  Gradient Boosting Accuracy: {gb_accuracy:.3f}")
        logger.info(f"  Ensemble Accuracy: {ensemble_accuracy:.3f}")
        
        return results
    
    def predict_mining_potential(self, asteroid_features: Dict) -> Dict:
        """
        Predict mining potential for a single asteroid
        
        Args:
            asteroid_features: Dictionary with asteroid features
            
        Returns:
            Dictionary with predictions and confidence scores
        """
        if not self.rf_model or not self.gb_model:
            raise ValueError("Models not trained. Call train_models() first.")
        
        # Convert features to DataFrame for consistent preprocessing
        df = pd.DataFrame([asteroid_features])
        X, _ = self.prepare_features(df)
        X_scaled = self.scaler.transform(X)
        
        # Get predictions from both models
        rf_proba = self.rf_model.predict_proba(X_scaled)[0]
        gb_proba = self.gb_model.predict_proba(X_scaled)[0]
        
        # Ensemble prediction
        ensemble_proba = (rf_proba + gb_proba) / 2
        ensemble_pred = np.argmax(ensemble_proba)
        
        # Convert to readable labels
        classes = self.label_encoder.classes_
        
        return {
            'predicted_class': classes[ensemble_pred],
            'confidence': float(ensemble_proba[ensemble_pred]),
            'class_probabilities': {
                classes[i]: float(prob) for i, prob in enumerate(ensemble_proba)
            },
            'rf_prediction': classes[np.argmax(rf_proba)],
            'gb_prediction': classes[np.argmax(gb_proba)]
        }
    
    def batch_predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Predict mining potential for multiple asteroids
        
        Args:
            df: DataFrame with asteroid data
            
        Returns:
            DataFrame with added prediction columns
        """
        if not self.rf_model or not self.gb_model:
            raise ValueError("Models not trained. Call train_models() first.")
        
        X, _ = self.prepare_features(df)
        X_scaled = self.scaler.transform(X)
        
        # Get ensemble predictions
        rf_proba = self.rf_model.predict_proba(X_scaled)
        gb_proba = self.gb_model.predict_proba(X_scaled)
        ensemble_proba = (rf_proba + gb_proba) / 2
        ensemble_pred = np.argmax(ensemble_proba, axis=1)
        
        # Add predictions to DataFrame
        result_df = df.copy()
        result_df['predicted_mining_class'] = self.label_encoder.inverse_transform(ensemble_pred)
        result_df['prediction_confidence'] = np.max(ensemble_proba, axis=1)
        
        # Add individual class probabilities
        classes = self.label_encoder.classes_
        for i, class_name in enumerate(classes):
            result_df[f'prob_{class_name.lower().replace(" ", "_")}'] = ensemble_proba[:, i]
        
        return result_df
    
    def get_feature_importance(self) -> Dict:
        """Get feature importance from trained models"""
        return self.feature_importance
    
    def save_models(self):
        """Save trained models to disk"""
        if self.rf_model:
            joblib.dump(self.rf_model, self.models_dir / 'random_forest_model.pkl')
        if self.gb_model:
            joblib.dump(self.gb_model, self.models_dir / 'gradient_boosting_model.pkl')
        
        joblib.dump(self.scaler, self.models_dir / 'feature_scaler.pkl')
        joblib.dump(self.label_encoder, self.models_dir / 'label_encoder.pkl')
        
        # Save feature names
        with open(self.models_dir / 'feature_names.txt', 'w') as f:
            for name in self.feature_names:
                f.write(f"{name}\n")
        
        logger.info(f"Models saved to {self.models_dir}")
    
    def load_models(self):
        """Load trained models from disk"""
        try:
            self.rf_model = joblib.load(self.models_dir / 'random_forest_model.pkl')
            self.gb_model = joblib.load(self.models_dir / 'gradient_boosting_model.pkl')
            self.scaler = joblib.load(self.models_dir / 'feature_scaler.pkl')
            self.label_encoder = joblib.load(self.models_dir / 'label_encoder.pkl')
            
            # Load feature names
            with open(self.models_dir / 'feature_names.txt', 'r') as f:
                self.feature_names = [line.strip() for line in f]
            
            logger.info("Models loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            return False
    
    def plot_feature_importance(self, save_path: str = None):
        """Plot feature importance from trained models"""
        if not self.feature_importance:
            logger.warning("No feature importance data available")
            return
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Random Forest importance
        rf_importance = self.feature_importance['random_forest']
        sorted_rf = sorted(rf_importance.items(), key=lambda x: x[1], reverse=True)[:15]
        features, importance = zip(*sorted_rf)
        
        ax1.barh(range(len(features)), importance)
        ax1.set_yticks(range(len(features)))
        ax1.set_yticklabels(features)
        ax1.set_title('Random Forest Feature Importance')
        ax1.set_xlabel('Importance')
        
        # Gradient Boosting importance
        gb_importance = self.feature_importance['gradient_boosting']
        sorted_gb = sorted(gb_importance.items(), key=lambda x: x[1], reverse=True)[:15]
        features, importance = zip(*sorted_gb)
        
        ax2.barh(range(len(features)), importance)
        ax2.set_yticks(range(len(features)))
        ax2.set_yticklabels(features)
        ax2.set_title('Gradient Boosting Feature Importance')
        ax2.set_xlabel('Importance')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            logger.info(f"Feature importance plot saved to {save_path}")
        
        plt.show()

class MiningPotentialAnalyzer:
    """
    Advanced analyzer for asteroid mining potential assessment
    """
    
    def __init__(self):
        self.classifier = AsteroidMiningClassifier()
    
    def analyze_mining_potential(self, df: pd.DataFrame) -> Dict:
        """
        Comprehensive analysis of asteroid mining potential
        
        Args:
            df: DataFrame with asteroid data
            
        Returns:
            Dictionary with analysis results
        """
        analysis = {}
        
        # Basic statistics
        analysis['total_asteroids'] = len(df)
        analysis['with_physical_data'] = df['diameter_km'].notna().sum()
        analysis['with_orbital_data'] = df['semi_major_axis'].notna().sum()
        
        # Mining score distribution
        scores = df['combined_mining_score'].dropna()
        analysis['score_stats'] = {
            'mean': scores.mean(),
            'median': scores.median(),
            'std': scores.std(),
            'min': scores.min(),
            'max': scores.max()
        }
        
        # Classification by potential
        high_potential = df[df['combined_mining_score'] >= 0.8]
        medium_potential = df[(df['combined_mining_score'] >= 0.6) & (df['combined_mining_score'] < 0.8)]
        low_potential = df[(df['combined_mining_score'] >= 0.4) & (df['combined_mining_score'] < 0.6)]
        
        analysis['potential_distribution'] = {
            'high': len(high_potential),
            'medium': len(medium_potential),
            'low': len(low_potential),
            'very_low': len(df) - len(high_potential) - len(medium_potential) - len(low_potential)
        }
        
        # Top candidates
        top_candidates = df.nlargest(10, 'combined_mining_score')
        analysis['top_candidates'] = top_candidates[['name', 'combined_mining_score', 
                                                    'diameter_km', 'orbit_class_name']].to_dict('records')
        
        return analysis

if __name__ == "__main__":
    # Test the ML models
    import sys
    sys.path.append('.')
    
    # Mock data for testing
    np.random.seed(42)
    n_samples = 1000
    
    mock_data = {
        'name': [f'Asteroid_{i}' for i in range(n_samples)],
        'diameter_km': np.random.lognormal(0, 1, n_samples),
        'albedo': np.random.uniform(0.05, 0.5, n_samples),
        'absolute_magnitude': np.random.uniform(10, 25, n_samples),
        'semi_major_axis': np.random.uniform(0.8, 3.0, n_samples),
        'eccentricity': np.random.uniform(0, 0.9, n_samples),
        'inclination': np.random.uniform(0, 40, n_samples),
        'orbit_class_code': np.random.choice(['AMO', 'APO', 'ATE', 'MBA'], n_samples)
    }
    
    # Add derived features
    for i in range(n_samples):
        a = mock_data['semi_major_axis'][i]
        e = mock_data['eccentricity'][i]
        mock_data.setdefault('periapsis_distance', []).append(a * (1 - e))
        mock_data.setdefault('apoapsis_distance', []).append(a * (1 + e))
        mock_data.setdefault('earth_moid', []).append(np.random.uniform(0.01, 0.5))
        mock_data.setdefault('delta_v_estimate', []).append(np.random.uniform(1000, 8000))
        mock_data.setdefault('accessibility_score', []).append(np.random.uniform(20, 95))
        mock_data.setdefault('orbit_class_mining_score', []).append(np.random.uniform(0.3, 0.9))
        mock_data.setdefault('size_mining_score', []).append(np.random.uniform(0.4, 1.0))
        mock_data.setdefault('composition_score', []).append(np.random.uniform(0.5, 0.9))
        
        # Combined score
        combined = (mock_data['accessibility_score'][-1]/100 * 0.4 + 
                   mock_data['orbit_class_mining_score'][-1] * 0.2 +
                   mock_data['size_mining_score'][-1] * 0.2 +
                   mock_data['composition_score'][-1] * 0.2)
        mock_data.setdefault('combined_mining_score', []).append(combined)
    
    df = pd.DataFrame(mock_data)
    
    # Train models
    classifier = AsteroidMiningClassifier()
    results = classifier.train_models(df)
    
    # Test prediction
    test_asteroid = {
        'diameter_km': 0.5,
        'albedo': 0.15,
        'absolute_magnitude': 18.0,
        'semi_major_axis': 1.2,
        'eccentricity': 0.3,
        'inclination': 5.0,
        'periapsis_distance': 0.84,
        'apoapsis_distance': 1.56,
        'earth_moid': 0.05,
        'delta_v_estimate': 2500,
        'accessibility_score': 75,
        'orbit_class_mining_score': 0.8,
        'size_mining_score': 0.8,
        'composition_score': 0.7,
        'orbit_class_code': 'APO'
    }
    
    prediction = classifier.predict_mining_potential(test_asteroid)
    print("\n🤖 ML Model Test Results:")
    print(f"Predicted Class: {prediction['predicted_class']}")
    print(f"Confidence: {prediction['confidence']:.3f}")
    print("Class Probabilities:")
    for cls, prob in prediction['class_probabilities'].items():
        print(f"  {cls}: {prob:.3f}")
