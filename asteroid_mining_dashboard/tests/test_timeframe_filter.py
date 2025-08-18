import os
import sys
from datetime import datetime, timedelta, UTC

import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from asteroid_mining_dashboard.src.data_collector import AsteroidDataProcessor


def test_collect_neo_dataset_timeframe_runs(monkeypatch):
    # Monkeypatch network methods to avoid live calls
    class DummyCollector:
        def __init__(self, key):
            pass
        def fetch_neo_browse_data(self, page=0, size=20):
            # Return a minimal NEO structure
            return {
                'near_earth_objects': [
                    {
                        'neo_reference_id': '3542519',
                        'name': 'Test NEO',
                        'designation': '2025 AB',
                        'nasa_jpl_url': 'http://example',
                        'is_potentially_hazardous_asteroid': False
                    }
                ]
            }
        def fetch_sbdb_asteroid_data(self, object_id: str):
            return {
                'object': {
                    'spkid': '2000433',
                    'fullname': 'Test NEO',
                    'neo': True,
                    'pha': False,
                    'orbit_class': {'code': 'APO', 'name': 'Apollo'}
                },
                'phys_par': {
                    'diameter': 0.7,
                    'albedo': 0.2,
                    'H': 18.0,
                    'G': 0.15
                },
                'orbit': {
                    'epoch': '2025-01-01',
                    'elements': [
                        {'a': 1.2, 'e': 0.15, 'i': 5.0, 'om': 80.0, 'w': 30.0, 'ma': 10.0}
                    ],
                    'moids': {'earth': 0.05}
                }
            }
        def fetch_close_approach_data(self, date_min: str, date_max: str, min_dist_au: float = 0.2):
            return {
                'fields': ['des', 'cd', 'dist'],
                'data': [['2025 AB', '2025-01-01', 0.05]]
            }

    # Patch the processor to use dummy collector
    from asteroid_mining_dashboard.src import data_collector as dc
    orig = dc.MultiAgencyDataCollector
    dc.MultiAgencyDataCollector = DummyCollector
    try:
        proc = dc.AsteroidDataProcessor('dummy', output_dir=os.path.join(os.path.dirname(__file__), '..', 'data'))
        now_utc = datetime.now(UTC)
        start = (now_utc - timedelta(days=1)).strftime('%Y-%m-%d')
        end = now_utc.strftime('%Y-%m-%d')
        df = proc.collect_neo_dataset(max_pages=1, date_min=start, date_max=end)
        assert not df.empty
        assert 'sbdb_browse_url' in df.columns
        assert 'composition_class' in df.columns
        assert 'likely_minerals' in df.columns
    finally:
        dc.MultiAgencyDataCollector = orig
