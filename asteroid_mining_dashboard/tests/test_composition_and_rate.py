import os
import sys
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from asteroid_mining_dashboard.src.enhanced_ml_models import EnhancedAsteroidMiningClassifier
from asteroid_mining_dashboard.src.rate_limit import RateLimitTracker


def test_composition_inference_labels():
    # Use more rows to satisfy stratified split in training
    df = pd.DataFrame({
        'name': list('abcdefghij'),
        'diameter': [50,60,70,80,90,100,110,120,130,140],
        'albedo': [0.05,0.08,0.12,0.18,0.22,0.28,0.1,0.15,0.35,0.4],
        'semi_major_axis': [1.0,1.1,1.2,1.3,1.4,1.1,1.2,1.3,1.4,1.5],
        'eccentricity': [0.05,0.1,0.2,0.15,0.25,0.3,0.05,0.1,0.2,0.15],
        'inclination': [2,3,5,10,12,8,6,4,9,7],
        'absolute_magnitude': [20,19,18,21,22,23,19,18,21,20]
    })
    clf = EnhancedAsteroidMiningClassifier()
    clf.train_models(df)
    res = clf.predict_mining_potential(df)
    assert 'composition_class' in res.columns
    assert 'likely_minerals' in res.columns
    assert set(res['composition_class']).issubset({'Carbonaceous','Silicaceous','Metallic'})


def test_rate_limiter_basic():
    rl = RateLimitTracker(hourly_limit=5, min_interval_seconds=0)
    for _ in range(3):
        rl.before_request()
        rl.after_response({})
    st = rl.status()
    assert st['used'] == 3
    assert st['remaining'] == 2
