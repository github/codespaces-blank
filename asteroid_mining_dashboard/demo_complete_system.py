#!/usr/bin/env python3
"""
Comprehensive demo of the AI-Driven Asteroid Mining Classification System
Tests all components and generates sample results
"""

import sys
import os
import argparse
package_root = os.path.dirname(__file__)
parent_dir = os.path.dirname(package_root)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

import pandas as pd
import numpy as np
from asteroid_mining_dashboard.src.enhanced_ml_models import EnhancedAsteroidMiningClassifier
from asteroid_mining_dashboard.src.data_collector import AsteroidDataProcessor

def comprehensive_demo(use_nasa: bool = False, pages: int = 1, api_key: str = ""):
    """
    Run a comprehensive demonstration of all system capabilities
    """
    print("🚀 AI-DRIVEN ASTEROID MINING CLASSIFICATION SYSTEM")
    print("=" * 60)
    print("Team: Bharatiya Antariksh Khani")
    print("=" * 60)
    
    # 1. Generate diverse asteroid dataset (for training)
    print("\n📊 PHASE 1: Preparing Training Dataset")
    print("-" * 50)
    
    np.random.seed(42)
    n_asteroids = 1200
    
    # Create realistic asteroid population with variety (synthetic training data)
    train_data = pd.DataFrame({
        'name': [f'NEA-{i:04d}' for i in range(n_asteroids)],
        'diameter': np.random.lognormal(mean=2.5, sigma=1.5, size=n_asteroids),
        'albedo': np.random.beta(1.5, 6, size=n_asteroids) * 0.7,
        'semi_major_axis': np.random.uniform(0.6, 5.0, size=n_asteroids),
        'eccentricity': np.random.beta(2, 3, size=n_asteroids),
        'inclination': np.random.exponential(scale=10, size=n_asteroids),
        'absolute_magnitude': np.random.uniform(12, 32, size=n_asteroids)
    })
    
    print(f"✅ Generated synthetic training set: {len(train_data)} asteroids")
    
    # 2. Initialize and train ML classifier
    print("\n🤖 PHASE 2: Training Advanced ML Classification Models")
    print("-" * 50)
    
    classifier = EnhancedAsteroidMiningClassifier()
    training_results = classifier.train_models(train_data)
    
    print(f"✅ Random Forest Accuracy: {training_results['rf_accuracy']:.3f}")
    print(f"✅ Gradient Boosting Accuracy: {training_results['gb_accuracy']:.3f}")
    
    print("\n🔍 Top Feature Importance:")
    for _, row in training_results['feature_importance'].head().iterrows():
        print(f"   {row['feature']}: {row['importance']:.3f}")
    
    # 3. Run predictions on all asteroids
    print("\n🔬 PHASE 3: Running AI Classification on Asteroid Population")
    print("-" * 50)
    
    # 3. Acquire dataset for prediction: either synthetic or live NASA
    if use_nasa:
        print("\n📡 PHASE 3: Fetching NASA Live NEO Data")
        print("-" * 50)
        if not api_key:
            print("❌ NASA API key required for live data. Falling back to synthetic predictions.")
            predictions = classifier.predict_mining_potential(train_data)
        else:
            processor = AsteroidDataProcessor(api_key, output_dir=os.path.join(os.path.dirname(__file__), 'data'))
            live_df = processor.collect_neo_dataset(max_pages=pages)
            # Map columns to expected names and units
            if 'diameter_km' in live_df.columns:
                live_df = live_df.rename(columns={'diameter_km': 'diameter'})
                live_df['diameter'] = pd.to_numeric(live_df['diameter'], errors='coerce').fillna(0) * 1000.0
            for col in ['albedo', 'semi_major_axis', 'eccentricity']:
                if col in live_df.columns:
                    live_df[col] = pd.to_numeric(live_df[col], errors='coerce')
            print(f"✅ Fetched {len(live_df)} NEOs from NASA across {pages} page(s)")
            rate = processor.get_rate_status()
            print(f"📊 Rate Limit: used {rate['used']}/{rate['hourly_limit']} | remaining {rate['remaining']} | reset in {int(rate['seconds_to_reset'])}s")
            predictions = classifier.predict_mining_potential(live_df)
    else:
        print("\n🔬 PHASE 3: Running AI Classification on Synthetic Dataset")
        print("-" * 50)
        predictions = classifier.predict_mining_potential(train_data)
    
    # Classification summary
    classification_summary = predictions['mining_potential'].value_counts()
    print("\n📊 Classification Results:")
    for category, count in classification_summary.items():
        percentage = (count / len(predictions)) * 100
        print(f"   {category}: {count:,} asteroids ({percentage:.1f}%)")
    
    # 4. Analyze high-value targets
    print("\n🏆 PHASE 4: Analyzing High-Value Mining Targets")
    print("-" * 50)
    
    high_value = predictions[predictions['mining_potential'] == 'High Value']
    moderate_value = predictions[predictions['mining_potential'] == 'Moderate Value']
    valuable_total = pd.concat([high_value, moderate_value])
    
    if len(valuable_total) > 0:
        print(f"✅ Found {len(valuable_total)} valuable mining targets")
        
        # Top 10 by confidence
        top_targets = valuable_total.nlargest(10, 'confidence_score')
        print("\n🎯 Top 10 Mining Targets by Confidence:")
        for i, (_, asteroid) in enumerate(top_targets.iterrows(), 1):
            print(f"   {i:2d}. {asteroid['name']}")
            print(f"       Category: {asteroid['mining_potential']}")
            print(f"       Confidence: {asteroid['confidence_score']:.3f}")
            print(f"       Diameter: {asteroid['diameter']:.1f} m")
            print(f"       Economic Value: {asteroid['economic_value']:.2f}")
            print(f"       Delta-V: {asteroid['delta_v_estimate']:.2f} km/s")
            print()
        
        # Economic analysis
        total_economic_value = valuable_total['economic_value'].sum()
        avg_delta_v = valuable_total['delta_v_estimate'].mean()
        
        print(f"📈 Economic Analysis:")
        print(f"   Total Economic Value Score: {total_economic_value:.1f}")
        print(f"   Average Mission Delta-V: {avg_delta_v:.2f} km/s")
        print(f"   Most Accessible: {valuable_total.nsmallest(1, 'delta_v_estimate')['name'].iloc[0]}")
        print(f"   Highest Value: {valuable_total.nlargest(1, 'economic_value')['name'].iloc[0]}")
    
    else:
        print("⚠️  No high-value targets found in current dataset")
    
    # 5. Mission planning analysis
    print("\n🚀 PHASE 5: Mission Planning Analysis")
    print("-" * 50)
    
    # Define mission scenarios
    scenarios = {
        'Quick Survey': {'max_delta_v': 3.0, 'min_confidence': 0.7},
        'High Value Extraction': {'max_delta_v': 6.0, 'min_economic': 3.0},
        'Scientific Research': {'mission_types': ['Scientific Interest'], 'max_delta_v': 8.0},
        'Commercial Mining': {'min_diameter': 100, 'max_delta_v': 5.0, 'min_economic': 2.0}
    }
    
    for scenario_name, criteria in scenarios.items():
        filtered = predictions.copy()
        
        # Apply filters
        if 'max_delta_v' in criteria:
            filtered = filtered[filtered['delta_v_estimate'] <= criteria['max_delta_v']]
        if 'min_confidence' in criteria:
            filtered = filtered[filtered['confidence_score'] >= criteria['min_confidence']]
        if 'min_economic' in criteria:
            filtered = filtered[filtered['economic_value'] >= criteria['min_economic']]
        if 'min_diameter' in criteria:
            filtered = filtered[filtered['diameter'] >= criteria['min_diameter']]
        if 'mission_types' in criteria:
            filtered = filtered[filtered['mining_potential'].isin(criteria['mission_types'])]
        
        print(f"   {scenario_name}: {len(filtered)} candidates")
        
        if len(filtered) > 0:
            best_candidate = filtered.nlargest(1, 'confidence_score')
            candidate = best_candidate.iloc[0]
            print(f"     Best: {candidate['name']} ({candidate['confidence_score']:.3f} confidence)")
    
    # 6. Save results
    print("\n💾 PHASE 6: Saving Results and Models")
    print("-" * 50)
    
    # Save predictions
    predictions.to_csv('data/asteroid_mining_predictions.csv', index=False)
    print("✅ Saved predictions to data/asteroid_mining_predictions.csv")
    
    # Save models
    classifier.save_models('models/demo_mining_classifier')
    print("✅ Saved trained models to models/demo_mining_classifier_*.pkl")
    
    # Generate summary report
    summary_stats = {
        'total_asteroids': len(predictions),
        'high_value_targets': len(high_value),
        'moderate_value_targets': len(moderate_value),
        'rf_accuracy': training_results['rf_accuracy'],
        'gb_accuracy': training_results['gb_accuracy'],
        'avg_confidence': predictions['confidence_score'].mean(),
        'avg_delta_v': predictions['delta_v_estimate'].mean()
    }
    
    with open('data/classification_summary.txt', 'w') as f:
        f.write("AI-Driven Asteroid Mining Classification Summary\n")
        f.write("=" * 50 + "\n")
        for key, value in summary_stats.items():
            f.write(f"{key}: {value}\n")
    
    print("✅ Saved summary statistics to data/classification_summary.txt")
    
    # 7. Dashboard information
    print("\n🌐 PHASE 7: Dashboard Access Information")
    print("-" * 50)
    print("🎯 Live Dashboards Available:")
    print("   Enhanced Dashboard: http://localhost:8502")
    print("   Basic Dashboard: http://localhost:8501")
    print()
    print("📋 To explore results interactively:")
    print("   1. Use 'Generate Demo Data' in the dashboard")
    print("   2. Run 'AI Classification' ")
    print("   3. Explore mining targets and mission planning")
    print()
    print("🔬 Data Sources:")
    print("   - Generated asteroid population with realistic distributions")
    print("   - Known asteroid analogs (Psyche, Bennu, Ryugu, etc.)")
    print("   - AI-engineered features for mining assessment")
    
    print("\n" + "=" * 60)
    print("🎉 DEMONSTRATION COMPLETE!")
    print("=" * 60)
    print("Team Bharatiya Antariksh Khani")
    print("AI-Driven Asteroid Mining Resource Classification Dashboard")
    print("Ready for space resource extraction missions! 🚀")
    
    return predictions, classifier

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Asteroid Mining Classification Demo")
    parser.add_argument("--use-nasa", action="store_true", help="Fetch live NASA NEO data for predictions")
    parser.add_argument("--pages", type=int, default=1, help="Number of NEO browse pages to fetch (20 per page)")
    parser.add_argument("--api-key", type=str, default="", help="NASA API key")
    args = parser.parse_args()

    predictions, classifier = comprehensive_demo(use_nasa=args.use_nasa, pages=args.pages, api_key=args.api_key)
