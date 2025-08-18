# AI-Driven Asteroid Mining Dashboard (Bharatiya Antariksh Khani)

This repository provides an advanced Streamlit dashboard and ML pipeline to identify and rank Near-Earth Asteroids for mining potential. It integrates NASA APIs with a reusable rate limiter, offers composition inference, mission planning metrics, and timeframe-based fetching.

## Quick start
- Install dependencies: `pip install -r requirements.txt`
- Run the Enhanced dashboard:
  - `streamlit run asteroid_mining_dashboard/dashboard.py`

  For headless mode: `/workspaces/codespaces-blank/.venv/bin/python -m streamlit run asteroid_mining_dashboard/dashboard.py --server.headless true --server.port 8501`
  
Tip: In the Enhanced dashboard, choose "NASA Live Data" and set a timeframe (start/end dates) to fetch nearby asteroids for those dates. Your API key is prefilled.

## Key features
- **Advanced ML Pipeline**: Hyperparameter-tuned Random Forest & Gradient Boosting ensemble with intelligent missing data imputation
- **Interactive Dashboard**: Streamlit-cached NASA data with filtering by viability score, resource type, and asteroid name search
- **Detailed Asteroid Profiles**: Complete composition analysis with likely minerals/metals and mission planning trajectories  
- **Feature Importance Visualization**: Understand which factors drive mining potential predictions
- **Mission Planning Tools**: Delta-V analysis with launch window optimization and accessibility scoring
- Live NASA data with timeframe filter (CAD) and rate-limit status
- ML classifier (RF+GB) with composition inference (Carbonaceous/Silicaceous/Metallic) and likely minerals
- Mission planning metrics (delta-v estimate, accessibility)
- CSV outputs saved in asteroid_mining_dashboard/data/

## Common asteroid compositions
- C-type (Carbonaceous): Clay and silicate rocks; organic carbon compounds; hydrated minerals (water-bearing)
- S-type (Silicaceous): Silicate minerals (olivine, pyroxene); nickel-iron metal
- M-type (Metallic): Nickel-iron metal; cobalt; precious platinum-group metals (platinum, palladium, iridium, osmium, ruthenium, rhodium); gold
  - Likely metals field is also exposed in outputs

## Advanced ML Features
- **Intelligent Imputation**: Missing albedo values filled by spectral class group medians
- **Hyperparameter Optimization**: RandomizedSearchCV for optimal model parameters  
- **Mining Viability Scoring**: 3-class system based on spectral type and orbital accessibility
- **Cross-Validation**: Stratified K-Fold for robust accuracy measurement
- **Feature Standardization**: StandardScaler normalization for consistent feature scales

## Dashboard Capabilities
- **Interactive Filtering**: Filter by mining viability score, potential resources, asteroid name search
- **Detailed Profiles**: Complete asteroid analysis with composition breakdown and mission windows
- **Feature Importance**: Bar charts showing which factors most influence mining predictions
- **Mission Planning**: Delta-V vs duration scatter plots with optimal launch window recommendations
- **Caching**: Streamlit data caching for fast NASA API responses

## Project structure
- asteroid_mining_dashboard/
  - src/: core modules (data collector, models, mission planning, rate limit)
  - enhanced_dashboard.py (main interactive dashboard)
  - data/, models/ (generated; gitignored)
- requirements.txt (complete dependency list)
- examples/ and extra docs removed per request; this repo keeps one README only.

## Tests
- pytest -q

## Rate limiting
- The reusable tracker parses server headers and maintains a rolling hourly window; status shown in UI and demo output.
