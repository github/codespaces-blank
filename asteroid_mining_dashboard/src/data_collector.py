#!/usr/bin/env python3
"""
AI-Driven Asteroid Mining Resource Classification Dashboard
Team: Bharatiya Antariksh Khani

Core data collection module for multi-agency asteroid data integration.
Supports NASA SBDB, ESA PSA, and ISRO ISSDC data sources.
"""

import requests
import pandas as pd
import numpy as np
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging
from pathlib import Path

# Local utility for rate limiting
from .rate_limit import RateLimitTracker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MultiAgencyDataCollector:
    """
    Integrated data collector for NASA, ESA, and ISRO asteroid databases
    """
    
    def __init__(self, nasa_api_key: str):
        self.nasa_api_key = nasa_api_key
        self.session = requests.Session()
        
        # API endpoints
        self.nasa_sbdb_url = "https://ssd-api.jpl.nasa.gov/sbdb.api"
        self.nasa_cad_url = "https://ssd-api.jpl.nasa.gov/cad.api"
        self.nasa_neo_url = "https://api.nasa.gov/neo/rest/v1"
        
        # Rate limiting
        self.request_count = 0
        self.last_request_time = time.time()
        self.min_request_interval = 0.1  # 100ms between requests
        self.rate_tracker = RateLimitTracker(hourly_limit=1000, min_interval_seconds=self.min_request_interval)
        
    def _rate_limit(self):
        """Simple rate limiting to avoid overwhelming APIs"""
        # Old behavior retained for compatibility
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.min_request_interval:
            time.sleep(self.min_request_interval - time_since_last)
        self.last_request_time = time.time()
        self.request_count += 1
        
        # New tracker-based behavior
        self.rate_tracker.before_request()
    
    def _record_response(self, response: Optional[requests.Response] = None):
        headers = response.headers if response is not None else None
        self.rate_tracker.after_response(headers)
        status = self.rate_tracker.status()
        logger.debug(f"Rate status: used {status['used']}/{status['hourly_limit']} remaining {status['remaining']}")

    def get_rate_status(self) -> Dict:
        """Return current rate limiting status."""
        return self.rate_tracker.status()

    def fetch_sbdb_asteroid_data(self, object_id: str) -> Optional[Dict]:
        """
        Fetch detailed asteroid data from NASA's Small Body Database
        
        Args:
            object_id: Asteroid designation or SPK-ID
            
        Returns:
            Dictionary containing asteroid data or None if failed
        """
        self._rate_limit()
        
        params = {
            'sstr': object_id,
            'full-prec': True,
            'phys-par': True,
            'close-appr': True,
            'orbit': True
        }
        
        try:
            response = self.session.get(self.nasa_sbdb_url, params=params)
            response.raise_for_status()
            self._record_response(response)
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch SBDB data for {object_id}: {e}")
            self._record_response(None)
            return None
    
    def fetch_neo_browse_data(self, page: int = 0, size: int = 20) -> Optional[Dict]:
        """
        Fetch NEO browse data from NASA's NEO API
        
        Args:
            page: Page number (0-based)
            size: Number of results per page (max 20)
            
        Returns:
            Dictionary containing NEO browse data
        """
        self._rate_limit()
        
        params = {
            'page': page,
            'size': size,
            'api_key': self.nasa_api_key
        }
        
        try:
            url = f"{self.nasa_neo_url}/neo/browse"
            response = self.session.get(url, params=params)
            response.raise_for_status()
            self._record_response(response)
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch NEO browse data: {e}")
            self._record_response(None)
            return None
    
    def fetch_close_approach_data(self, date_min: str, date_max: str, 
                                min_dist_au: float = 0.05) -> Optional[Dict]:
        """
        Fetch close approach data from NASA's CAD API
        
        Args:
            date_min: Start date (YYYY-MM-DD)
            date_max: End date (YYYY-MM-DD)
            min_dist_au: Minimum approach distance in AU
            
        Returns:
            Dictionary containing close approach data
        """
        self._rate_limit()
        
        params = {
            'date-min': date_min,
            'date-max': date_max,
            'dist-min': str(min_dist_au),
            'sort': 'dist',
            'api_key': self.nasa_api_key
        }
        
        try:
            response = self.session.get(self.nasa_cad_url, params=params)
            response.raise_for_status()
            self._record_response(response)
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch CAD data: {e}")
            self._record_response(None)
            return None

class AsteroidFeatureExtractor:
    """
    Extract and engineer features for mining potential classification
    """
    
    @staticmethod
    def extract_physical_features(sbdb_data: Dict) -> Dict:
        """Extract physical characteristics from SBDB data"""
        features = {}
        
        try:
            obj = sbdb_data.get('object', {})
            phys = sbdb_data.get('phys_par', {})
            
            # Basic object info
            features['spk_id'] = obj.get('spkid', '')
            features['full_name'] = obj.get('fullname', '')
            features['neo'] = obj.get('neo', False)
            features['pha'] = obj.get('pha', False)
            
            # Orbit class
            orbit_class = obj.get('orbit_class', {})
            features['orbit_class_code'] = orbit_class.get('code', '')
            features['orbit_class_name'] = orbit_class.get('name', '')
            
            # Physical parameters
            if phys:
                features['diameter_km'] = phys.get('diameter', None)
                features['albedo'] = phys.get('albedo', None)
                features['rotation_period'] = phys.get('rot_per', None)
                features['absolute_magnitude'] = phys.get('H', None)
                features['slope_parameter'] = phys.get('G', None)
                # Optional spectral types
                features['spectral_type_tholen'] = phys.get('spec_T', None)
                features['spectral_type_bus'] = phys.get('spec_B', None)
            
        except Exception as e:
            logger.error(f"Error extracting physical features: {e}")
            
        return features
    
    @staticmethod
    def extract_orbital_features(sbdb_data: Dict) -> Dict:
        """Extract orbital characteristics from SBDB data"""
        features = {}
        
        try:
            orbit = sbdb_data.get('orbit', {})
            elements = orbit.get('elements', [])
            
            if elements and len(elements) > 0:
                elem = elements[0]  # Use most recent elements
                
                features['semi_major_axis'] = elem.get('a', None)
                features['eccentricity'] = elem.get('e', None)
                features['inclination'] = elem.get('i', None)
                features['longitude_ascending_node'] = elem.get('om', None)
                features['argument_periapsis'] = elem.get('w', None)
                features['mean_anomaly'] = elem.get('ma', None)
                features['epoch'] = orbit.get('epoch', None)
                
                # Calculate additional orbital parameters
                if elem.get('a') and elem.get('e'):
                    a = float(elem['a'])
                    e = float(elem['e'])
                    features['periapsis_distance'] = a * (1 - e)
                    features['apoapsis_distance'] = a * (1 + e)
                    
                # MOID (Minimum Orbit Intersection Distance)
                moid = orbit.get('moids', {})
                features['earth_moid'] = moid.get('earth', None)
                
        except Exception as e:
            logger.error(f"Error extracting orbital features: {e}")
            
        return features
    
    @staticmethod
    def calculate_mining_score_features(physical_features: Dict, orbital_features: Dict) -> Dict:
        """Calculate derived features for mining potential scoring"""
        features = {}
        
        try:
            # Accessibility score based on delta-v approximation
            if orbital_features.get('semi_major_axis') and orbital_features.get('eccentricity'):
                a = float(orbital_features['semi_major_axis'])
                e = float(orbital_features['eccentricity'])
                
                # Simplified delta-v approximation (actual calculation requires more complex orbital mechanics)
                # This is a rough estimate for demonstration
                earth_a = 1.0  # Earth's semi-major axis in AU
                delta_v_approx = abs(a - earth_a) * 1000 + e * 500  # Simplified formula
                features['delta_v_estimate'] = delta_v_approx
                features['accessibility_score'] = max(0, 100 - delta_v_approx / 10)
            
            # Resource richness indicators
            orbit_class = physical_features.get('orbit_class_code', '')
            
            # Assign mining potential based on orbit class and composition indicators
            mining_potential_map = {
                'AMO': 0.7,  # Amor - Earth-crossing
                'APO': 0.8,  # Apollo - Earth-crossing
                'ATE': 0.9,  # Aten - Earth-crossing
                'IEO': 0.6,  # Interior Earth Object
                'MBA': 0.4,  # Main Belt Asteroid
                'TJN': 0.3,  # Jupiter Trojan
                'CEN': 0.2,  # Centaur
            }
            
            features['orbit_class_mining_score'] = mining_potential_map.get(orbit_class, 0.5)
            
            # Size-based scoring (larger asteroids potentially more valuable)
            diameter = physical_features.get('diameter_km')
            if diameter:
                diameter_km = float(diameter)
                if diameter_km > 1.0:
                    features['size_mining_score'] = 1.0
                elif diameter_km > 0.5:
                    features['size_mining_score'] = 0.8
                elif diameter_km > 0.1:
                    features['size_mining_score'] = 0.6
                else:
                    features['size_mining_score'] = 0.4
            else:
                features['size_mining_score'] = 0.5
            
            # Albedo-based composition estimate
            albedo = physical_features.get('albedo')
            if albedo:
                albedo_val = float(albedo)
                if albedo_val < 0.1:  # Dark, potentially carbonaceous
                    features['composition_score'] = 0.9  # High water/organic content
                elif albedo_val < 0.2:  # Moderate albedo
                    features['composition_score'] = 0.7  # Mixed composition
                else:  # Bright, potentially metallic
                    features['composition_score'] = 0.8  # Potential metals
            else:
                features['composition_score'] = 0.6
            
            # Combined mining potential score
            accessibility = features.get('accessibility_score', 50) / 100
            orbit_score = features.get('orbit_class_mining_score', 0.5)
            size_score = features.get('size_mining_score', 0.5)
            comp_score = features.get('composition_score', 0.6)
            
            features['combined_mining_score'] = (
                accessibility * 0.4 + 
                orbit_score * 0.2 + 
                size_score * 0.2 + 
                comp_score * 0.2
            )
            
        except Exception as e:
            logger.error(f"Error calculating mining score features: {e}")
            
        return features

    @staticmethod
    def infer_composition(physical_features: Dict) -> Dict:
        """Infer composition class and likely minerals/metals."""
        comp = {
            'composition_class': None,
            'likely_minerals': None,
            'likely_metals': None,
            'metal_rich_probability': None,
            'water_ice_probability': None
        }
        try:
            spec = (physical_features.get('spectral_type_bus') or physical_features.get('spectral_type_tholen') or '')
            spec = spec.upper() if isinstance(spec, str) else ''
            albedo = physical_features.get('albedo')

            def set_c():
                comp.update({
                    'composition_class': 'Carbonaceous',
                    'likely_minerals': 'Clay and silicate rocks; organic carbon compounds; hydrated minerals (water-bearing)',
                    'likely_metals': 'Trace metals; generally low metal concentrations',
                    'metal_rich_probability': 0.15,
                    'water_ice_probability': 0.7
                })

            def set_s():
                comp.update({
                    'composition_class': 'Silicaceous',
                    'likely_minerals': 'Silicate minerals (olivine, pyroxene); nickel-iron metal',
                    'likely_metals': 'Nickel-iron (Fe-Ni) metal',
                    'metal_rich_probability': 0.35,
                    'water_ice_probability': 0.25
                })

            def set_m():
                comp.update({
                    'composition_class': 'Metallic',
                    'likely_minerals': 'Nickel-iron metal; cobalt; precious platinum-group metals (platinum, palladium, iridium, osmium, ruthenium, rhodium); gold',
                    'likely_metals': 'Nickel, iron, cobalt, platinum-group metals (Pt, Pd, Ir, Os, Ru, Rh), gold',
                    'metal_rich_probability': 0.8,
                    'water_ice_probability': 0.1
                })

            if spec.startswith('C'):
                set_c()
            elif spec.startswith('S'):
                set_s()
            elif spec.startswith('M'):
                set_m()
            else:
                # Fallback to albedo heuristics
                try:
                    if albedo is not None:
                        a = float(albedo)
                        if a < 0.1:
                            set_c()
                        elif a < 0.2:
                            set_s()
                        else:
                            set_m()
                except Exception:
                    pass
        except Exception as e:
            logger.error(f"Error inferring composition: {e}")
        return comp

    @staticmethod
    def build_sbdb_url(sstr: Optional[str]) -> Optional[str]:
        """Build a NASA SBDB browser URL for a given search string (spk id or designation)."""
        if not sstr:
            return None
        try:
            return f"https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr={sstr}"
        except Exception:
            return None

class AsteroidDataProcessor:
    """
    Main processor for collecting and processing asteroid data
    """
    
    def __init__(self, nasa_api_key: str, output_dir: str = "data"):
        self.collector = MultiAgencyDataCollector(nasa_api_key)
        self.feature_extractor = AsteroidFeatureExtractor()
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

    def get_rate_status(self) -> Dict:
        """Expose underlying collector rate status."""
        return self.collector.get_rate_status()
        
    def collect_neo_dataset(self, max_pages: int = 10, date_min: Optional[str] = None, date_max: Optional[str] = None) -> pd.DataFrame:
        """
        Collect comprehensive NEO dataset with features for ML training
        
        Args:
            max_pages: Maximum number of pages to fetch from NEO browse API
            
        Returns:
            DataFrame with asteroid features
        """
        all_asteroids = []
        
        logger.info(f"Starting NEO data collection (max {max_pages} pages)")
        
        # Optionally use CAD to filter by timeframe for "nearby" objects
        cad_filter_ids = set()
        if date_min and date_max:
            cad = self.collector.fetch_close_approach_data(date_min, date_max, min_dist_au=0.2)
            if cad and 'data' in cad and 'fields' in cad:
                try:
                    fields = cad['fields']
                    des_idx = fields.index('des') if 'des' in fields else None
                    for row in cad['data']:
                        if des_idx is not None:
                            cad_filter_ids.add(str(row[des_idx]))
                except Exception:
                    pass

        for page in range(max_pages):
            logger.info(f"Fetching page {page + 1}/{max_pages}")
            
            # Fetch NEO browse data
            browse_data = self.collector.fetch_neo_browse_data(page=page)
            if not browse_data:
                break
                
            neos = browse_data.get('near_earth_objects', [])
            if not neos:
                break
                
            for neo in neos:
                asteroid_data = {}
                
                # Basic NEO data
                asteroid_data['neo_reference_id'] = neo.get('neo_reference_id')
                asteroid_data['name'] = neo.get('name')
                asteroid_data['designation'] = neo.get('designation')
                asteroid_data['nasa_jpl_url'] = neo.get('nasa_jpl_url')
                asteroid_data['is_potentially_hazardous'] = neo.get('is_potentially_hazardous_asteroid')
                
                # Filter by timeframe via CAD if provided
                if cad_filter_ids and neo.get('designation') not in cad_filter_ids:
                    continue

                # Get detailed SBDB data (prefer designation or name over raw numeric id)
                sstr_value = (
                    neo.get('designation')
                    or neo.get('name')
                )
                # Skip if we only have numeric NEO reference ID (causes SBDB 400 errors)
                if not sstr_value and neo.get('neo_reference_id'):
                    # Try to construct a valid designation from numeric ID if possible
                    neo_id = str(neo.get('neo_reference_id', ''))
                    if len(neo_id) > 4 and neo_id.isdigit():
                        # Skip numeric-only IDs that cause SBDB issues
                        logger.debug(f"Skipping numeric NEO ID {neo_id} (likely to cause SBDB 400)")
                        sstr_value = None
                    else:
                        sstr_value = neo_id
                        
                if sstr_value:
                    sbdb_data = self.collector.fetch_sbdb_asteroid_data(sstr_value)
                    if sbdb_data:
                        # Extract features
                        physical_features = self.feature_extractor.extract_physical_features(sbdb_data)
                        orbital_features = self.feature_extractor.extract_orbital_features(sbdb_data)
                        mining_features = self.feature_extractor.calculate_mining_score_features(
                            physical_features, orbital_features
                        )
                        composition = self.feature_extractor.infer_composition(physical_features)
                        
                        # Combine all features
                        asteroid_data.update(physical_features)
                        asteroid_data.update(orbital_features)
                        asteroid_data.update(mining_features)
                        asteroid_data.update(composition)
                        asteroid_data['sbdb_raw'] = json.dumps(sbdb_data)[:50000]
                        # SBDB quick link
                        spk = physical_features.get('spk_id') or asteroid_data.get('designation')
                        url = self.feature_extractor.build_sbdb_url(spk)
                        if url:
                            asteroid_data['sbdb_browse_url'] = url
                
                all_asteroids.append(asteroid_data)
                
                # Small delay to be respectful to APIs
                time.sleep(0.1)
        
        # Convert to DataFrame
        df = pd.DataFrame(all_asteroids)
        if not df.empty:
            for num_col in ['diameter_km', 'albedo', 'semi_major_axis', 'eccentricity', 'inclination',
                            'periapsis_distance', 'apoapsis_distance', 'earth_moid', 'delta_v_estimate',
                            'accessibility_score', 'combined_mining_score']:
                if num_col in df.columns:
                    df[num_col] = pd.to_numeric(df[num_col], errors='coerce')
        
        # Save to file
        output_file = self.output_dir / f"neo_dataset_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        df.to_csv(output_file, index=False)
        logger.info(f"Saved {len(df)} asteroid records to {output_file}")
        
        return df
    
    def collect_mining_candidates(self, min_diameter_km: float = 0.1, 
                                max_delta_v: float = 5000) -> pd.DataFrame:
        """
        Collect asteroids that meet basic mining criteria
        
        Args:
            min_diameter_km: Minimum diameter in kilometers
            max_delta_v: Maximum estimated delta-v in m/s
            
        Returns:
            DataFrame with filtered mining candidates
        """
        # First collect general NEO dataset
        df = self.collect_neo_dataset(max_pages=20)
        
        # Filter for mining candidates
        mining_candidates = df[
            (df['diameter_km'].fillna(0) >= min_diameter_km) &
            (df['delta_v_estimate'].fillna(10000) <= max_delta_v) &
            (df['combined_mining_score'].fillna(0) >= 0.5)
        ].copy()
        
        # Sort by mining score
        mining_candidates = mining_candidates.sort_values('combined_mining_score', ascending=False)
        
        # Save filtered results
        output_file = self.output_dir / f"mining_candidates_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        mining_candidates.to_csv(output_file, index=False)
        logger.info(f"Found {len(mining_candidates)} mining candidates")
        
        return mining_candidates

if __name__ == "__main__":
    # Test the data collection system
    NASA_API_KEY = "ieNKM2I1HjxFtKde7SNHEUmqlI5zj3A6MriHgbZC"
    
    processor = AsteroidDataProcessor(NASA_API_KEY)
    
    # Collect mining candidates
    candidates = processor.collect_mining_candidates(max_delta_v=3000)
    
    print(f"\n🚀 Found {len(candidates)} potential mining candidates")
    if len(candidates) > 0:
        print("\nTop 10 Mining Candidates:")
        print("="*80)
        top_candidates = candidates.head(10)
        for idx, asteroid in top_candidates.iterrows():
            print(f"🪐 {asteroid.get('name', 'Unknown')}")
            print(f"   Mining Score: {asteroid.get('combined_mining_score', 0):.3f}")
            print(f"   Diameter: {asteroid.get('diameter_km', 'Unknown')} km")
            print(f"   Delta-V Est: {asteroid.get('delta_v_estimate', 'Unknown')} m/s")
            print(f"   Orbit Class: {asteroid.get('orbit_class_name', 'Unknown')}")
            print()
