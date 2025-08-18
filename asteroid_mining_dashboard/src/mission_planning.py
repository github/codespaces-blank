#!/usr/bin/env python3
"""
AI-Driven Asteroid Mining Resource Classification Dashboard
Team: Bharatiya Antariksh Khani

Mission planning module for delta-v calculations and trajectory analysis.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
import math
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OrbitalMechanics:
    """
    Orbital mechanics calculations for asteroid mission planning
    """
    
    # Constants
    AU = 149597870.7  # Astronomical Unit in km
    MU_SUN = 1.327e11  # Standard gravitational parameter of Sun (km³/s²)
    EARTH_SOI = 924000  # Earth's sphere of influence radius (km)
    
    @staticmethod
    def kepler_to_cartesian(a: float, e: float, i: float, omega: float, 
                          w: float, M: float, mu: float = MU_SUN) -> Tuple[np.ndarray, np.ndarray]:
        """
        Convert Keplerian orbital elements to Cartesian coordinates
        
        Args:
            a: Semi-major axis (km)
            e: Eccentricity
            i: Inclination (degrees)
            omega: Longitude of ascending node (degrees)
            w: Argument of periapsis (degrees)
            M: Mean anomaly (degrees)
            mu: Standard gravitational parameter
            
        Returns:
            Tuple of position and velocity vectors
        """
        # Convert angles to radians
        i_rad = math.radians(i)
        omega_rad = math.radians(omega)
        w_rad = math.radians(w)
        M_rad = math.radians(M)
        
        # Solve Kepler's equation for eccentric anomaly (simplified)
        E = M_rad + e * math.sin(M_rad)  # First approximation
        for _ in range(5):  # Newton-Raphson iteration
            E = E - (E - e * math.sin(E) - M_rad) / (1 - e * math.cos(E))
        
        # True anomaly
        nu = 2 * math.atan2(math.sqrt(1 + e) * math.sin(E/2), 
                           math.sqrt(1 - e) * math.cos(E/2))
        
        # Distance
        r = a * (1 - e * math.cos(E))
        
        # Position in orbital plane
        x_orb = r * math.cos(nu)
        y_orb = r * math.sin(nu)
        z_orb = 0
        
        # Velocity in orbital plane
        h = math.sqrt(mu * a * (1 - e**2))  # Specific angular momentum
        vx_orb = -mu * math.sin(E) / (h * (1 - e * math.cos(E)))
        vy_orb = mu * (math.cos(E) - e) / (h * (1 - e * math.cos(E)))
        vz_orb = 0
        
        # Rotation matrices for 3D transformation
        cos_omega, sin_omega = math.cos(omega_rad), math.sin(omega_rad)
        cos_i, sin_i = math.cos(i_rad), math.sin(i_rad)
        cos_w, sin_w = math.cos(w_rad), math.sin(w_rad)
        
        # Transform to heliocentric coordinates
        x = (cos_omega * cos_w - sin_omega * sin_w * cos_i) * x_orb + \
            (-cos_omega * sin_w - sin_omega * cos_w * cos_i) * y_orb
        y = (sin_omega * cos_w + cos_omega * sin_w * cos_i) * x_orb + \
            (-sin_omega * sin_w + cos_omega * cos_w * cos_i) * y_orb
        z = (sin_w * sin_i) * x_orb + (cos_w * sin_i) * y_orb
        
        vx = (cos_omega * cos_w - sin_omega * sin_w * cos_i) * vx_orb + \
             (-cos_omega * sin_w - sin_omega * cos_w * cos_i) * vy_orb
        vy = (sin_omega * cos_w + cos_omega * sin_w * cos_i) * vx_orb + \
             (-sin_omega * sin_w + cos_omega * cos_w * cos_i) * vy_orb
        vz = (sin_w * sin_i) * vx_orb + (cos_w * sin_i) * vy_orb
        
        return np.array([x, y, z]), np.array([vx, vy, vz])
    
    @staticmethod
    def lambert_solver_approximation(r1: np.ndarray, r2: np.ndarray, 
                                   tof: float, mu: float = MU_SUN) -> Tuple[np.ndarray, np.ndarray]:
        """
        Simplified Lambert problem solver for transfer orbits
        
        Args:
            r1: Initial position vector (km)
            r2: Final position vector (km)
            tof: Time of flight (seconds)
            mu: Standard gravitational parameter
            
        Returns:
            Tuple of initial and final velocity vectors
        """
        # Vector magnitudes
        r1_mag = np.linalg.norm(r1)
        r2_mag = np.linalg.norm(r2)
        
        # Chord length
        c = np.linalg.norm(r2 - r1)
        
        # Semi-perimeter
        s = (r1_mag + r2_mag + c) / 2
        
        # Minimum energy transfer approximation
        a_min = s / 2
        
        # Transfer angle (simplified)
        cos_dnu = np.dot(r1, r2) / (r1_mag * r2_mag)
        dnu = math.acos(np.clip(cos_dnu, -1, 1))
        
        # Approximate semi-major axis
        a = a_min * (1 + 0.1 * abs(dnu - math.pi))
        
        # Velocity magnitudes (simplified)
        v1_mag = math.sqrt(mu * (2/r1_mag - 1/a))
        v2_mag = math.sqrt(mu * (2/r2_mag - 1/a))
        
        # Direction vectors (simplified)
        h = np.cross(r1, r2)
        h_unit = h / np.linalg.norm(h)
        
        # Approximate velocity directions
        v1_dir = np.cross(h_unit, r1)
        v1_dir = v1_dir / np.linalg.norm(v1_dir)
        
        v2_dir = np.cross(h_unit, r2)
        v2_dir = v2_dir / np.linalg.norm(v2_dir)
        
        v1 = v1_mag * v1_dir
        v2 = v2_mag * v2_dir
        
        return v1, v2

class DeltaVCalculator:
    """
    Calculate delta-v requirements for asteroid missions
    """
    
    def __init__(self):
        self.orbital_mechanics = OrbitalMechanics()
        
        # Earth orbital parameters (approximate)
        self.earth_orbit = {
            'a': 1.0 * self.orbital_mechanics.AU,  # 1 AU
            'e': 0.0167,
            'i': 0.0,
            'omega': 0.0,
            'w': 102.9,
            'v_orbital': 29.78  # km/s
        }
    
    def calculate_hohmann_transfer_dv(self, target_a: float, target_e: float = 0) -> Dict:
        """
        Calculate delta-v for Hohmann transfer to target orbit
        
        Args:
            target_a: Target semi-major axis (AU)
            target_e: Target eccentricity
            
        Returns:
            Dictionary with delta-v components
        """
        earth_a = self.earth_orbit['a'] / self.orbital_mechanics.AU  # Convert to AU
        target_a_km = target_a * self.orbital_mechanics.AU
        earth_a_km = earth_a * self.orbital_mechanics.AU
        
        # Hohmann transfer semi-major axis
        a_transfer = (earth_a_km + target_a_km) / 2
        
        # Velocities
        v_earth = math.sqrt(self.orbital_mechanics.MU_SUN / earth_a_km)
        v_target = math.sqrt(self.orbital_mechanics.MU_SUN / target_a_km)
        
        # Transfer orbit velocities
        v_transfer_earth = math.sqrt(self.orbital_mechanics.MU_SUN * (2/earth_a_km - 1/a_transfer))
        v_transfer_target = math.sqrt(self.orbital_mechanics.MU_SUN * (2/target_a_km - 1/a_transfer))
        
        # Delta-v calculations
        dv1 = abs(v_transfer_earth - v_earth)  # Departure
        dv2 = abs(v_target - v_transfer_target)  # Arrival
        
        total_dv = dv1 + dv2
        
        # Transfer time (half orbital period of transfer ellipse)
        transfer_time = math.pi * math.sqrt(a_transfer**3 / self.orbital_mechanics.MU_SUN)
        
        return {
            'departure_dv': dv1 / 1000,  # km/s
            'arrival_dv': dv2 / 1000,    # km/s
            'total_dv': total_dv / 1000, # km/s
            'transfer_time_years': transfer_time / (365.25 * 24 * 3600),
            'transfer_a': a_transfer / self.orbital_mechanics.AU
        }
    
    def calculate_asteroid_mission_dv(self, asteroid_params: Dict) -> Dict:
        """
        Calculate comprehensive delta-v for asteroid mission
        
        Args:
            asteroid_params: Dictionary with asteroid orbital parameters
            
        Returns:
            Dictionary with mission delta-v breakdown
        """
        a = asteroid_params.get('semi_major_axis', 1.0)  # AU
        e = asteroid_params.get('eccentricity', 0.0)
        i = asteroid_params.get('inclination', 0.0)  # degrees
        
        # Basic Hohmann transfer
        hohmann = self.calculate_hohmann_transfer_dv(a, e)
        
        # Inclination change penalty
        inclination_dv = 0
        if i > 0:
            # Simplified inclination change at aphelion
            v_aphelion = math.sqrt(self.orbital_mechanics.MU_SUN * 
                                 (2/(a * self.orbital_mechanics.AU) - 
                                  1/(a * self.orbital_mechanics.AU)))
            inclination_dv = 2 * v_aphelion * math.sin(math.radians(i/2)) / 1000
        
        # Eccentricity penalty
        eccentricity_dv = 0
        if e > 0.1:
            # Additional delta-v for high eccentricity
            eccentricity_dv = e * 0.5  # Simplified estimate
        
        # Earth departure costs
        c3 = (hohmann['departure_dv'] * 1000)**2  # Characteristic energy
        v_infinity = math.sqrt(c3) / 1000
        
        # Launch vehicle estimates (simplified)
        if v_infinity <= 3:
            launch_capability = "Atlas V 401"
            max_payload = 8900  # kg to escape
        elif v_infinity <= 5:
            launch_capability = "Falcon Heavy"
            max_payload = 16800  # kg to escape
        else:
            launch_capability = "SLS Block 1"
            max_payload = 27000  # kg to escape
        
        total_mission_dv = (hohmann['total_dv'] + inclination_dv + 
                          eccentricity_dv + 0.5)  # 0.5 km/s margin
        
        return {
            'hohmann_dv': hohmann['total_dv'],
            'inclination_dv': inclination_dv,
            'eccentricity_dv': eccentricity_dv,
            'total_mission_dv': total_mission_dv,
            'transfer_time_years': hohmann['transfer_time_years'],
            'c3_energy': c3,
            'v_infinity': v_infinity,
            'recommended_launcher': launch_capability,
            'max_payload_kg': max_payload,
            'mission_difficulty': self._assess_mission_difficulty(total_mission_dv, i, e)
        }
    
    def _assess_mission_difficulty(self, total_dv: float, inclination: float, 
                                 eccentricity: float) -> str:
        """Assess overall mission difficulty"""
        difficulty_score = 0
        
        # Delta-v component
        if total_dv > 8:
            difficulty_score += 3
        elif total_dv > 6:
            difficulty_score += 2
        elif total_dv > 4:
            difficulty_score += 1
        
        # Inclination component
        if inclination > 20:
            difficulty_score += 2
        elif inclination > 10:
            difficulty_score += 1
        
        # Eccentricity component
        if eccentricity > 0.5:
            difficulty_score += 2
        elif eccentricity > 0.3:
            difficulty_score += 1
        
        if difficulty_score >= 5:
            return "Very High"
        elif difficulty_score >= 3:
            return "High"
        elif difficulty_score >= 2:
            return "Medium"
        else:
            return "Low"

class MissionPlanningOptimizer:
    """
    Optimize mission planning parameters for asteroid mining missions
    """
    
    def __init__(self):
        self.delta_v_calculator = DeltaVCalculator()
    
    def optimize_launch_windows(self, asteroid_params: Dict, 
                              years_ahead: int = 10) -> List[Dict]:
        """
        Find optimal launch windows for asteroid missions
        
        Args:
            asteroid_params: Asteroid orbital parameters
            years_ahead: Number of years to look ahead
            
        Returns:
            List of optimal launch opportunities
        """
        opportunities = []
        
        # Simplified approach - look for synodic periods
        earth_period = 1.0  # years
        asteroid_period = (asteroid_params.get('semi_major_axis', 1.0))**1.5  # Kepler's 3rd law
        
        if asteroid_period > earth_period:
            synodic_period = 1 / (1/earth_period - 1/asteroid_period)
        else:
            synodic_period = 1 / (1/asteroid_period - 1/earth_period)
        
        # Generate launch opportunities
        current_year = datetime.now().year
        for i in range(int(years_ahead / synodic_period) + 1):
            launch_year = current_year + i * synodic_period
            
            # Calculate mission parameters for this window
            mission_dv = self.delta_v_calculator.calculate_asteroid_mission_dv(asteroid_params)
            
            # Add some variability based on orbital positions
            dv_variation = 1 + 0.2 * math.sin(2 * math.pi * i / 3)  # Simplified
            adjusted_dv = mission_dv['total_mission_dv'] * dv_variation
            
            opportunities.append({
                'launch_year': launch_year,
                'total_dv': adjusted_dv,
                'transfer_time': mission_dv['transfer_time_years'],
                'arrival_year': launch_year + mission_dv['transfer_time_years'],
                'difficulty': mission_dv['mission_difficulty'],
                'launcher': mission_dv['recommended_launcher']
            })
        
        # Sort by total delta-v
        opportunities.sort(key=lambda x: x['total_dv'])
        
        return opportunities[:5]  # Return top 5 opportunities
    
    def rank_mining_targets(self, asteroids_df: pd.DataFrame) -> pd.DataFrame:
        """
        Rank asteroids by mining potential considering mission feasibility
        
        Args:
            asteroids_df: DataFrame with asteroid data
            
        Returns:
            DataFrame with mission rankings
        """
        ranked_df = asteroids_df.copy()
        
        mission_scores = []
        delta_vs = []
        difficulties = []
        
        for _, asteroid in asteroids_df.iterrows():
            asteroid_params = {
                'semi_major_axis': asteroid.get('semi_major_axis', 1.0),
                'eccentricity': asteroid.get('eccentricity', 0.0),
                'inclination': asteroid.get('inclination', 0.0)
            }
            
            try:
                mission_data = self.delta_v_calculator.calculate_asteroid_mission_dv(asteroid_params)
                
                # Mission feasibility score
                dv = mission_data['total_mission_dv']
                difficulty = mission_data['mission_difficulty']
                
                # Score based on delta-v (lower is better)
                if dv <= 4:
                    dv_score = 1.0
                elif dv <= 6:
                    dv_score = 0.8
                elif dv <= 8:
                    dv_score = 0.6
                elif dv <= 10:
                    dv_score = 0.4
                else:
                    dv_score = 0.2
                
                # Difficulty penalty
                difficulty_map = {'Low': 1.0, 'Medium': 0.8, 'High': 0.6, 'Very High': 0.4}
                difficulty_score = difficulty_map.get(difficulty, 0.5)
                
                # Combined mission score
                mission_score = (dv_score + difficulty_score) / 2
                
            except:
                mission_score = 0.3
                dv = 999
                difficulty = 'Unknown'
            
            mission_scores.append(mission_score)
            delta_vs.append(dv)
            difficulties.append(difficulty)
        
        # Add mission planning columns
        ranked_df['mission_dv'] = delta_vs
        ranked_df['mission_difficulty'] = difficulties
        ranked_df['mission_score'] = mission_scores
        
        # Combined score: mining potential + mission feasibility
        mining_weight = 0.6
        mission_weight = 0.4
        
        ranked_df['combined_score'] = (
            ranked_df['combined_mining_score'].fillna(0.5) * mining_weight +
            ranked_df['mission_score'] * mission_weight
        )
        
        # Sort by combined score
        ranked_df = ranked_df.sort_values('combined_score', ascending=False)
        
        return ranked_df
    
    def generate_mission_report(self, asteroid_data: Dict) -> Dict:
        """
        Generate comprehensive mission report for a specific asteroid
        
        Args:
            asteroid_data: Dictionary with asteroid parameters
            
        Returns:
            Dictionary with mission report
        """
        # Calculate mission parameters
        orbital_params = {
            'semi_major_axis': asteroid_data.get('semi_major_axis', 1.0),
            'eccentricity': asteroid_data.get('eccentricity', 0.0),
            'inclination': asteroid_data.get('inclination', 0.0)
        }
        
        mission_dv = self.delta_v_calculator.calculate_asteroid_mission_dv(orbital_params)
        launch_windows = self.optimize_launch_windows(orbital_params)
        
        # Mission timeline
        best_window = launch_windows[0] if launch_windows else None
        
        # Resource estimates
        diameter = asteroid_data.get('diameter_km', 0.1)
        volume = (4/3) * math.pi * (diameter * 500)**3  # Convert km to m, assume spherical
        
        # Composition-based resource estimates (simplified)
        orbit_class = asteroid_data.get('orbit_class_code', 'UNK')
        if orbit_class in ['AMO', 'APO', 'ATE']:
            # Near-Earth asteroids - mixed composition
            water_content = 0.1  # 10% water
            metal_content = 0.2  # 20% metals
            rare_earth_content = 0.001  # 0.1% rare earths
        else:
            # Main belt or other - conservative estimates
            water_content = 0.05
            metal_content = 0.1
            rare_earth_content = 0.0005
        
        # Economic estimates (very simplified)
        water_value = volume * water_content * 1000 * 1000  # $1000/ton in space
        metal_value = volume * metal_content * 2000 * 5000  # $5000/ton
        rare_earth_value = volume * rare_earth_content * 2000 * 50000  # $50000/ton
        
        total_value = water_value + metal_value + rare_earth_value
        
        # Mission cost estimate
        mission_cost = mission_dv['total_mission_dv'] * 50e6  # $50M per km/s delta-v
        
        return {
            'asteroid_name': asteroid_data.get('name', 'Unknown'),
            'mission_parameters': mission_dv,
            'best_launch_window': best_window,
            'all_launch_windows': launch_windows,
            'resource_estimates': {
                'volume_m3': volume,
                'water_tons': volume * water_content * 2000,  # Assume 2000 kg/m³ density
                'metal_tons': volume * metal_content * 2000,
                'rare_earth_tons': volume * rare_earth_content * 2000,
                'total_estimated_value': total_value,
                'mission_cost_estimate': mission_cost,
                'roi_ratio': total_value / mission_cost if mission_cost > 0 else 0
            },
            'mission_feasibility': {
                'difficulty': mission_dv['mission_difficulty'],
                'recommended_launcher': mission_dv['recommended_launcher'],
                'payload_capacity': mission_dv['max_payload_kg'],
                'ready_for_mission': mission_dv['total_mission_dv'] < 8.0 and 
                                   asteroid_data.get('diameter_km', 0) > 0.1
            }
        }

if __name__ == "__main__":
    # Test mission planning calculations
    print("🚀 Testing Mission Planning Module")
    print("="*50)
    
    # Test asteroid parameters
    test_asteroid = {
        'name': 'Test Asteroid',
        'semi_major_axis': 1.2,  # AU
        'eccentricity': 0.15,
        'inclination': 5.0,  # degrees
        'diameter_km': 0.5,
        'orbit_class_code': 'APO'
    }
    
    # Initialize calculator
    planner = MissionPlanningOptimizer()
    
    # Generate mission report
    report = planner.generate_mission_report(test_asteroid)
    
    print(f"Mission Report for: {report['asteroid_name']}")
    print("-" * 30)
    print(f"Total Delta-V: {report['mission_parameters']['total_mission_dv']:.2f} km/s")
    print(f"Mission Difficulty: {report['mission_parameters']['mission_difficulty']}")
    print(f"Recommended Launcher: {report['mission_parameters']['recommended_launcher']}")
    print(f"Transfer Time: {report['mission_parameters']['transfer_time_years']:.1f} years")
    
    if report['best_launch_window']:
        window = report['best_launch_window']
        print(f"Best Launch Window: {window['launch_year']:.1f}")
        print(f"Window Delta-V: {window['total_dv']:.2f} km/s")
    
    resources = report['resource_estimates']
    print(f"\nResource Estimates:")
    print(f"  Water: {resources['water_tons']:,.0f} tons")
    print(f"  Metals: {resources['metal_tons']:,.0f} tons")
    print(f"  Total Value: ${resources['total_estimated_value']:,.0f}")
    print(f"  Mission Cost: ${resources['mission_cost_estimate']:,.0f}")
    print(f"  ROI Ratio: {resources['roi_ratio']:.1f}x")
    
    feasibility = report['mission_feasibility']
    print(f"\nMission Feasibility:")
    print(f"  Ready for Mission: {'Yes' if feasibility['ready_for_mission'] else 'No'}")
    print(f"  Payload Capacity: {feasibility['payload_capacity']:,} kg")
