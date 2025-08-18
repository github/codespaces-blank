"""
Enhanced Machine Learning Models for Asteroid Mining Classification
Implements advanced ensemble learning with comprehensive feature engineering
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
import joblib
import warnings
warnings.filterwarnings('ignore')

class EnhancedAsteroidMiningClassifier:
    """
    Advanced ML classifier for asteroid mining potential assessment
    Uses ensemble learning with comprehensive feature engineering
    """
    
    def __init__(self):
        self.rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        
        self.gb_model = GradientBoostingClassifier(
            n_estimators=150,
            learning_rate=0.1,
            max_depth=8,
            min_samples_split=5,
            random_state=42
        )
        
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = []
        self.mining_potential_categories = [
            'High Value',
            'Moderate Value', 
            'Low Value',
            'Scientific Interest',
            'Not Viable'
        ]
        # Optional imputers for numeric/categorical fallback
        self.numeric_imputer = SimpleImputer(strategy='median')
        self.categorical_imputer = SimpleImputer(strategy='constant', fill_value='Unknown')
        # Optional separate model for mining viability classification
        self.viability_model = RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight='balanced'
        )
        self.viability_scaler = StandardScaler()
        
        # Store best hyperparameters and feature importance
        self.best_params_rf = {}
        self.best_params_gb = {}
        self.feature_importance_df = None
        
    def engineer_features(self, df):
        """
        Advanced feature engineering for asteroid mining classification
        """
        print("🔧 Engineering features for asteroid mining classification...")
        
        # Copy dataframe to avoid modifying original
        features_df = df.copy()
        
        # --- Intelligent imputation for missing data ---
        # Ensure expected identifier columns exist
        if 'spectral_type_bus' not in features_df.columns:
            # Some datasets may use 'spec_B' naming
            if 'spec_B' in features_df.columns:
                features_df['spectral_type_bus'] = features_df['spec_B']
            else:
                features_df['spectral_type_bus'] = None
        if 'spectral_type_tholen' not in features_df.columns and 'spec_T' in features_df.columns:
            features_df['spectral_type_tholen'] = features_df['spec_T']

        # Categorical: fill unknowns
        for cat_col in ['spectral_type_bus', 'spectral_type_tholen']:
            if cat_col in features_df.columns:
                features_df[cat_col] = features_df[cat_col].fillna('Unknown')

        # Numeric median by spectral class for key features like albedo
        if 'albedo' in features_df.columns:
            try:
                # Compute group medians by spectral type if available
                if 'spectral_type_bus' in features_df.columns:
                    grp_medians = features_df.groupby('spectral_type_bus')['albedo'].transform('median')
                    features_df['albedo'] = features_df['albedo'].fillna(grp_medians)
                # Global median fallback
                features_df['albedo'] = features_df['albedo'].fillna(features_df['albedo'].median())
            except Exception:
                # Final safety fallback
                features_df['albedo'] = features_df['albedo'].fillna(features_df['albedo'].median())

        # Global median imputation for other numeric columns commonly used
        for num_col in ['diameter', 'semi_major_axis', 'eccentricity', 'inclination']:
            if num_col in features_df.columns:
                try:
                    if features_df[num_col].isna().any():
                        features_df[num_col] = pd.to_numeric(features_df[num_col], errors='coerce')
                        features_df[num_col] = features_df[num_col].fillna(features_df[num_col].median())
                except Exception:
                    pass
        
        # Basic validation
        required_cols = ['diameter', 'albedo', 'semi_major_axis', 'eccentricity']
        for col in required_cols:
            if col not in features_df.columns:
                features_df[col] = np.random.uniform(0.1, 1.0, len(features_df))
        
        # 1. SIZE-BASED FEATURES
        features_df['log_diameter'] = np.log10(features_df['diameter'] + 0.001)
        features_df['size_category'] = pd.cut(
            features_df['diameter'], 
            bins=[0, 10, 100, 1000, float('inf')],
            labels=['Tiny', 'Small', 'Medium', 'Large']
        )
        
        # 2. COMPOSITIONAL FEATURES
        # Simulate spectral type based on albedo
        def _spectral_type(alb: float) -> str:
            try:
                a = float(alb)
            except Exception:
                a = 0.15
            if a < 0.1:
                return 'C'  # Carbonaceous
            elif a < 0.2:
                return 'S'  # Silicaceous
            else:
                return 'M'  # Metallic

        # Prefer bus taxonomy letter if present, else infer from albedo
        if 'spectral_type_bus' in features_df.columns:
            features_df['spectral_class'] = features_df['spectral_type_bus'].astype(str).str[:1].str.upper().replace({'U': 'C'})
        else:
            features_df['spectral_class'] = features_df['albedo'].apply(_spectral_type)
        features_df['spectral_type_numeric'] = features_df['spectral_class'].map({'C': 1, 'S': 2, 'M': 3}).fillna(2)

        # Composition inference
        def _composition_from_spectral(s: str) -> dict:
            if s == 'C':
                return {
                    'composition_class': 'Carbonaceous',
                    'likely_minerals': 'Clay and silicate rocks; organic carbon compounds; hydrated minerals (water-bearing)',
                    'likely_metals': 'Trace metals; generally low metal concentrations',
                    'metal_rich_probability': 0.15,
                    'water_ice_probability': 0.7
                }
            if s == 'S':
                return {
                    'composition_class': 'Silicaceous',
                    'likely_minerals': 'Silicate minerals (olivine, pyroxene); nickel-iron metal',
                    'likely_metals': 'Nickel-iron (Fe-Ni) metal',
                    'metal_rich_probability': 0.35,
                    'water_ice_probability': 0.25
                }
            return {
                'composition_class': 'Metallic',
                'likely_minerals': 'Nickel-iron metal; cobalt; precious platinum-group metals (platinum, palladium, iridium, osmium, ruthenium, rhodium); gold',
                'likely_metals': 'Nickel, iron, cobalt, platinum-group metals (Pt, Pd, Ir, Os, Ru, Rh), gold',
                'metal_rich_probability': 0.8,
                'water_ice_probability': 0.1
            }

        comp = features_df['spectral_class'].apply(_composition_from_spectral).apply(pd.Series)
        for col in comp.columns:
            features_df[col] = comp[col]
        
        # Mining potential based on spectral type and size
        features_df['metal_rich_indicator'] = (
            (features_df['albedo'] > 0.15) & 
            (features_df['diameter'] > 50)
        ).astype(int)
        
        # 3. ORBITAL DYNAMICS FEATURES
        features_df['orbital_period'] = np.sqrt(features_df['semi_major_axis']**3)
        features_df['aphelion'] = features_df['semi_major_axis'] * (1 + features_df['eccentricity'])
        features_df['perihelion'] = features_df['semi_major_axis'] * (1 - features_df['eccentricity'])
        
        # Earth crossing potential
        features_df['earth_crossing'] = (
            (features_df['perihelion'] < 1.017) & 
            (features_df['aphelion'] > 0.983)
        ).astype(int)
        
        # 4. ACCESSIBILITY FEATURES
        # Simplified delta-v estimation
        features_df['delta_v_estimate'] = (
            3.6 + 0.5 * abs(features_df['semi_major_axis'] - 1.0) +
            2.0 * features_df['eccentricity'] +
            np.random.uniform(0, 1, len(features_df))  # Add some randomness
        )
        
        features_df['accessibility_score'] = (
            10.0 / (1.0 + features_df['delta_v_estimate'])
        )
        
        # 5. ECONOMIC POTENTIAL FEATURES
        # Volume estimation (assuming spherical)
        features_df['volume'] = (4/3) * np.pi * (features_df['diameter']/2)**3
        
        # Mass estimation (kg)
        features_df['estimated_mass'] = features_df['volume'] * 2000  # kg/m³ density
        
        # Economic value indicator
        features_df['economic_value'] = (
            features_df['metal_rich_indicator'] * 
            np.log10(features_df['estimated_mass'] + 1) *
            features_df['accessibility_score']
        )
        
        # 6. HAZARD ASSESSMENT
        # Potentially Hazardous Asteroid (PHA) criteria
        features_df['pha_size_criteria'] = (features_df['diameter'] > 140).astype(int)
        features_df['moid_safe'] = 1  # Assume safe for now
        
        print(f"✅ Feature engineering complete. Created {len(features_df.columns)} features.")
        return features_df

    @staticmethod
    def assign_viability_score_row(row: pd.Series) -> int:
        """
        Assign a simple mining viability class based on spectral type and MOID/delta-v proxies.
        Returns 3 (High), 2 (Medium), or 1 (Low)
        """
        try:
            spec = (row.get('spectral_type_bus') or row.get('spectral_class') or '')
            spec = str(spec)[:1].upper() if isinstance(spec, (str,)) else ''
            moid = row.get('earth_moid') or row.get('moid_au')
            dv = row.get('delta_v_estimate')
            # Primary rule using MOID if available
            if moid is not None and pd.notna(moid):
                try:
                    m = float(moid)
                except Exception:
                    m = 1.0
                if (spec in ['M', 'C']) and (m < 0.05):
                    return 3
                elif (spec in ['S', 'V']) and (m < 0.1):
                    return 2
                else:
                    return 1
            # Fallback using delta-v estimate if available
            if dv is not None and pd.notna(dv):
                try:
                    d = float(dv)
                except Exception:
                    d = 10.0
                if (spec in ['M', 'C']) and (d < 5.0):
                    return 3
                elif (spec in ['S', 'V']) and (d < 7.0):
                    return 2
                else:
                    return 1
        except Exception:
            pass
        return 1
    
    def create_mining_labels(self, df):
        """
        Create target labels for mining potential classification
        """
        labels = []
        
        for _, row in df.iterrows():
            # High Value: Large, metal-rich, accessible
            if (row['diameter'] > 100 and 
                row['metal_rich_indicator'] == 1 and 
                row['accessibility_score'] > 5):
                labels.append('High Value')
            
            # Moderate Value: Medium size, some metal, reasonably accessible
            elif (row['diameter'] > 50 and 
                  row['economic_value'] > 2 and
                  row['accessibility_score'] > 3):
                labels.append('Moderate Value')
            
            # Low Value: Small but accessible
            elif (row['diameter'] > 10 and 
                  row['accessibility_score'] > 4):
                labels.append('Low Value')
            
            # Scientific Interest: Unusual properties
            elif (row['albedo'] > 0.3 or 
                  row['eccentricity'] > 0.5):
                labels.append('Scientific Interest')
            
            # Not Viable: Too small or inaccessible
            else:
                labels.append('Not Viable')
        
        return labels
    
    def prepare_training_data(self, df):
        """
        Prepare features and labels for training
        """
        # Engineer features
        features_df = self.engineer_features(df)
        
        # Create labels
        labels = self.create_mining_labels(features_df)
        
        # Select numerical features for training
        numerical_features = [
            'diameter', 'albedo', 'semi_major_axis', 'eccentricity',
            'log_diameter', 'spectral_type_numeric', 'metal_rich_indicator',
            'orbital_period', 'aphelion', 'perihelion', 'earth_crossing',
            'delta_v_estimate', 'accessibility_score', 'volume',
            'estimated_mass', 'economic_value', 'pha_size_criteria', 'moid_safe'
        ]
        
        # Filter available features
        available_features = [f for f in numerical_features if f in features_df.columns]
        X = features_df[available_features]
        y = labels
        
        self.feature_names = available_features
        
        return X, y
    
    def train_models(self, df, use_hyperparameter_tuning=True):
        """
        Train ensemble models on asteroid data with optional hyperparameter tuning
        """
        print("🚀 Training enhanced asteroid mining classification models...")
        
        # Prepare data
        X, y = self.prepare_training_data(df)
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        if use_hyperparameter_tuning:
            print("  🔧 Performing hyperparameter tuning...")
            
            # Random Forest hyperparameter tuning
            rf_param_grid = {
                'n_estimators': [100, 200, 300],
                'max_depth': [10, 15, 20, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4],
                'max_features': ['sqrt', 'log2']
            }
            
            rf_random_search = RandomizedSearchCV(
                estimator=RandomForestClassifier(random_state=42, class_weight='balanced'),
                param_distributions=rf_param_grid,
                n_iter=20,  # Number of parameter combinations to try
                cv=3,       # 3-fold CV for speed
                verbose=1,
                random_state=42,
                n_jobs=-1   # Use all available CPU cores
            )
            
            rf_random_search.fit(X_train_scaled, y_train)
            self.rf_model = rf_random_search.best_estimator_
            self.best_params_rf = rf_random_search.best_params_
            
            print(f"    Best RF params: {self.best_params_rf}")
            
            # Gradient Boosting hyperparameter tuning
            gb_param_grid = {
                'n_estimators': [100, 150, 200],
                'learning_rate': [0.05, 0.1, 0.15],
                'max_depth': [6, 8, 10],
                'min_samples_split': [2, 5, 10]
            }
            
            gb_random_search = RandomizedSearchCV(
                estimator=GradientBoostingClassifier(random_state=42),
                param_distributions=gb_param_grid,
                n_iter=15,
                cv=3,
                verbose=1,
                random_state=42,
                n_jobs=-1
            )
            
            gb_random_search.fit(X_train_scaled, y_train)
            self.gb_model = gb_random_search.best_estimator_
            self.best_params_gb = gb_random_search.best_params_
            
            print(f"    Best GB params: {self.best_params_gb}")
            
        else:
            # Train with default parameters
            print("  Training Random Forest...")
            self.rf_model.fit(X_train_scaled, y_train)
            
            print("  Training Gradient Boosting...")
            self.gb_model.fit(X_train_scaled, y_train)
        
        # Evaluate models
        rf_score = self.rf_model.score(X_test_scaled, y_test)
        gb_score = self.gb_model.score(X_test_scaled, y_test)
        
        # Ensemble predictions
        rf_pred = self.rf_model.predict(X_test_scaled)
        gb_pred = self.gb_model.predict(X_test_scaled)
        
        print(f"✅ Training complete!")
        print(f"   Random Forest Accuracy: {rf_score:.3f}")
        print(f"   Gradient Boosting Accuracy: {gb_score:.3f}")
        
        # Feature importance analysis
        rf_importance = self.rf_model.feature_importances_
        self.feature_importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': rf_importance
        }).sort_values('importance', ascending=False)
        
        print("\n🔍 Top 5 Most Important Features:")
        for _, row in self.feature_importance_df.head().iterrows():
            print(f"   {row['feature']}: {row['importance']:.3f}")
        
        return {
            'rf_accuracy': rf_score,
            'gb_accuracy': gb_score,
            'feature_importance': self.feature_importance_df,
            'best_params_rf': self.best_params_rf,
            'best_params_gb': self.best_params_gb
        }
    
    def predict_mining_potential(self, df):
        """
        Predict mining potential for new asteroids
        """
        # Engineer features
        features_df = self.engineer_features(df)
        
        # Select features
        X = features_df[self.feature_names]
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Get predictions from both models
        rf_pred_proba = self.rf_model.predict_proba(X_scaled)
        gb_pred_proba = self.gb_model.predict_proba(X_scaled)
        
        # Ensemble prediction (average probabilities)
        ensemble_proba = (rf_pred_proba + gb_pred_proba) / 2
        ensemble_pred = np.argmax(ensemble_proba, axis=1)
        
        # Convert back to labels
        predicted_labels = self.label_encoder.inverse_transform(ensemble_pred)
        
        # Calculate confidence scores
        confidence_scores = np.max(ensemble_proba, axis=1)
        
        # Add predictions to dataframe
        result_df = df.copy()
        result_df['mining_potential'] = predicted_labels
        result_df['confidence_score'] = confidence_scores
        result_df['economic_value'] = features_df['economic_value']
        result_df['accessibility_score'] = features_df['accessibility_score']
        result_df['delta_v_estimate'] = features_df['delta_v_estimate']
        # Compute a composite numeric mining score for ranking
        # Normalize economic value and accessibility within-batch
        econ = features_df['economic_value']
        acc = features_df['accessibility_score']
        econ_norm = econ / (float(econ.max()) + 1e-9)
        acc_norm = acc / (float(acc.max()) + 1e-9)
        # Composition weighting (resource richness proxy)
        comp_map = {
            'Metallic': 1.0,
            'Carbonaceous': 0.7,
            'Silicaceous': 0.6
        }
        comp_weight = features_df.get('composition_class')
        if comp_weight is not None:
            comp_weight = comp_weight.map(comp_map).fillna(0.65)
        else:
            comp_weight = pd.Series([0.65] * len(features_df), index=features_df.index)
        # Blend components: confidence-heavy but influenced by economics/accessibility/composition
        mining_score = (
            0.5 * result_df['confidence_score'] +
            0.2 * econ_norm +
            0.2 * acc_norm +
            0.1 * comp_weight
        )
        result_df['mining_score'] = mining_score.clip(lower=0.0, upper=1.0)
        # Bubble up composition fields for UX/tests
        for extra_col in ['composition_class', 'likely_minerals', 'likely_metals']:
            if extra_col in features_df.columns:
                result_df[extra_col] = features_df[extra_col]
        # Add viability score and label for UX/analytics
        try:
            result_df['mining_viability'] = features_df.apply(self.assign_viability_score_row, axis=1)
            result_df['viability_label'] = result_df['mining_viability'].map({3: 'High', 2: 'Medium', 1: 'Low'})
        except Exception:
            result_df['mining_viability'] = 1
            result_df['viability_label'] = 'Low'
        
        return result_df

    def train_viability_model(self, df):
        """Train a separate model to predict mining viability classes (1/2/3)."""
        feats = self.engineer_features(df)
        y = feats.apply(self.assign_viability_score_row, axis=1)
        numerical_features = [
            'diameter', 'albedo', 'semi_major_axis', 'eccentricity',
            'log_diameter', 'spectral_type_numeric', 'metal_rich_indicator',
            'orbital_period', 'aphelion', 'perihelion', 'earth_crossing',
            'delta_v_estimate', 'accessibility_score', 'volume',
            'estimated_mass', 'economic_value', 'pha_size_criteria'
        ]
        X = feats[[f for f in numerical_features if f in feats.columns]].copy()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        X_train_s = self.viability_scaler.fit_transform(X_train)
        X_test_s = self.viability_scaler.transform(X_test)
        self.viability_model.fit(X_train_s, y_train)
        acc = self.viability_model.score(X_test_s, y_test)
        return {'viability_accuracy': float(acc)}

    def predict_viability(self, df):
        """Predict viability class for new data using the trained viability model."""
        feats = self.engineer_features(df)
        numerical_features = [
            'diameter', 'albedo', 'semi_major_axis', 'eccentricity',
            'log_diameter', 'spectral_type_numeric', 'metal_rich_indicator',
            'orbital_period', 'aphelion', 'perihelion', 'earth_crossing',
            'delta_v_estimate', 'accessibility_score', 'volume',
            'estimated_mass', 'economic_value', 'pha_size_criteria'
        ]
        X = feats[[f for f in numerical_features if f in feats.columns]].copy()
        Xs = self.viability_scaler.transform(X)
        y_pred = self.viability_model.predict(Xs)
        out = df.copy()
        out['mining_viability_pred'] = y_pred
        out['viability_label_pred'] = out['mining_viability_pred'].map({3: 'High', 2: 'Medium', 1: 'Low'})
        return out

    def cross_validate_viability(self, df, n_splits: int = 5):
        """
        Evaluate a simple model predicting mining viability using Stratified K-Fold CV.
        Returns dict with mean/std accuracy and per-fold scores.
        """
        # Engineer features and labels
        feats = self.engineer_features(df)
        y = feats.apply(self.assign_viability_score_row, axis=1)
        # Feature selection (reuse primary numerical features where possible)
        numerical_features = [
            'diameter', 'albedo', 'semi_major_axis', 'eccentricity',
            'log_diameter', 'spectral_type_numeric', 'metal_rich_indicator',
            'orbital_period', 'aphelion', 'perihelion', 'earth_crossing',
            'delta_v_estimate', 'accessibility_score', 'volume',
            'estimated_mass', 'economic_value', 'pha_size_criteria'
        ]
        X = feats[[f for f in numerical_features if f in feats.columns]].copy()
        # Build pipeline to avoid leakage
        pipe = make_pipeline(StandardScaler(), RandomForestClassifier(n_estimators=150, random_state=42, class_weight='balanced'))
        cv = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
        scores = cross_val_score(pipe, X, y, cv=cv, scoring='accuracy')
        return {
            'cv_scores': scores.tolist(),
            'mean_accuracy': float(scores.mean()),
            'std_accuracy': float(scores.std())
        }
    
    def save_models(self, filepath_prefix):
        """
        Save trained models and metadata to disk
        """
        joblib.dump(self.rf_model, f"{filepath_prefix}_rf_model.pkl")
        joblib.dump(self.gb_model, f"{filepath_prefix}_gb_model.pkl")
        joblib.dump(self.scaler, f"{filepath_prefix}_scaler.pkl")
        joblib.dump(self.label_encoder, f"{filepath_prefix}_label_encoder.pkl")
        joblib.dump(self.feature_names, f"{filepath_prefix}_features.pkl")
        
        # Save hyperparameters and feature importance
        metadata = {
            'best_params_rf': self.best_params_rf,
            'best_params_gb': self.best_params_gb,
            'feature_importance': self.feature_importance_df.to_dict() if self.feature_importance_df is not None else None
        }
        joblib.dump(metadata, f"{filepath_prefix}_metadata.pkl")
        
        print(f"✅ Models and metadata saved with prefix: {filepath_prefix}")
    
    def load_models(self, filepath_prefix):
        """
        Load trained models and metadata from disk
        """
        try:
            self.rf_model = joblib.load(f"{filepath_prefix}_rf_model.pkl")
            self.gb_model = joblib.load(f"{filepath_prefix}_gb_model.pkl")
            self.scaler = joblib.load(f"{filepath_prefix}_scaler.pkl")
            self.label_encoder = joblib.load(f"{filepath_prefix}_label_encoder.pkl")
            self.feature_names = joblib.load(f"{filepath_prefix}_features.pkl")
            
            # Try to load metadata
            try:
                metadata = joblib.load(f"{filepath_prefix}_metadata.pkl")
                self.best_params_rf = metadata.get('best_params_rf', {})
                self.best_params_gb = metadata.get('best_params_gb', {})
                if metadata.get('feature_importance'):
                    self.feature_importance_df = pd.DataFrame(metadata['feature_importance'])
            except FileNotFoundError:
                print("  Metadata file not found, using defaults")
                
            print(f"✅ Models loaded from: {filepath_prefix}")
            return True
        except Exception as e:
            print(f"❌ Failed to load models: {e}")
            return False

def demo_enhanced_classification():
    """
    Demonstrate enhanced asteroid mining classification
    """
    print("🚀 Enhanced Asteroid Mining Classification Demo")
    print("=" * 50)
    
    # Create sample data
    np.random.seed(42)
    n_asteroids = 1000
    
    sample_data = pd.DataFrame({
        'name': [f'Asteroid_{i}' for i in range(n_asteroids)],
        'diameter': np.random.lognormal(mean=2, sigma=1, size=n_asteroids),
        'albedo': np.random.uniform(0.03, 0.6, size=n_asteroids),
        'semi_major_axis': np.random.uniform(0.8, 3.0, size=n_asteroids),
        'eccentricity': np.random.uniform(0.0, 0.8, size=n_asteroids),
        'inclination': np.random.uniform(0, 30, size=n_asteroids)
    })
    
    # Initialize classifier
    classifier = EnhancedAsteroidMiningClassifier()
    
    # Train models
    training_results = classifier.train_models(sample_data)
    
    # Make predictions
    predictions = classifier.predict_mining_potential(sample_data)
    
    # Show results
    print("\n📊 Classification Results:")
    print(predictions['mining_potential'].value_counts())
    
    print("\n🏆 Top 10 High-Value Mining Targets:")
    high_value = predictions[predictions['mining_potential'] == 'High Value']
    if not high_value.empty:
        top_targets = high_value.nlargest(10, 'confidence_score')
        for _, asteroid in top_targets.iterrows():
            print(f"  {asteroid['name']}: {asteroid['confidence_score']:.3f} confidence")
    else:
        print("  No high-value targets found in sample data")
    
    # Save models
    classifier.save_models("/workspaces/codespaces-blank/asteroid_mining_dashboard/models/enhanced_mining")
    
    return classifier, predictions

if __name__ == "__main__":
    classifier, predictions = demo_enhanced_classification()
