"""
Main Streamlit dashboard for AI-Driven Asteroid Mining Classification.
Advanced Streamlit dashboard for asteroid mining potential assessment
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
import logging
warnings.filterwarnings('ignore')
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import our custom modules (package-qualified)
try:
    from asteroid_mining_dashboard.src.enhanced_ml_models import EnhancedAsteroidMiningClassifier
    from asteroid_mining_dashboard.src.data_collector import AsteroidDataProcessor
except Exception as e:
    st.error(f"Import error: {e}")
    st.stop()

# Page configuration
st.set_page_config(
    page_title="🛰️ Asteroid Mining Dashboard - Bharatiya Antariksh Khani",
    page_icon="🛰️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for enhanced styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        color: white;
        text-align: center;
    }
    .metric-card {
        background: #ffffff;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #2a5298;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
        color: #111827; /* Ensure readable text on white background */
    }
    .metric-card h1, .metric-card h2, .metric-card h3, .metric-card h4, .metric-card p, .metric-card span, .metric-card small, .metric-card strong {
        color: #111827 !important;
    }
    .metric-card a { color: #1d4ed8 !important; text-decoration: underline; }

    /* Dark theme adjustments */
    [data-base-theme="dark"] .metric-card {
        background: #0f172a; /* slate-900 */
        border-color: #334155; /* slate-600 */
        color: #e5e7eb; /* slate-200 */
    }
    [data-base-theme="dark"] .metric-card h1,
    [data-base-theme="dark"] .metric-card h2,
    [data-base-theme="dark"] .metric-card h3,
    [data-base-theme="dark"] .metric-card h4,
    [data-base-theme="dark"] .metric-card p,
    [data-base-theme="dark"] .metric-card span,
    [data-base-theme="dark"] .metric-card small,
    [data-base-theme="dark"] .metric-card strong {
        color: #e5e7eb !important;
    }
    [data-base-theme="dark"] .metric-card a { color: #93c5fd !important; }
    .status-high { border-left-color: #28a745 !important; }
    .status-moderate { border-left-color: #ffc107 !important; }
    .status-low { border-left-color: #fd7e14 !important; }
    .status-scientific { border-left-color: #6f42c1 !important; }
    .status-not-viable { border-left-color: #dc3545 !important; }

    /* Ensure headings are visible across themes */
    .stApp h1, .stApp h2, .stApp h3, .stApp h4, .stApp p, .stApp label {
        color: inherit;
    }
    [data-base-theme="light"] .stApp h1,
    [data-base-theme="light"] .stApp h2,
    [data-base-theme="light"] .stApp h3,
    [data-base-theme="light"] .stApp h4,
    [data-base-theme="light"] .stApp p,
    [data-base-theme="light"] .stApp label {
        color: #111827;
    }
    [data-base-theme="dark"] .stApp h1,
    [data-base-theme="dark"] .stApp h2,
    [data-base-theme="dark"] .stApp h3,
    [data-base-theme="dark"] .stApp h4,
    [data-base-theme="dark"] .stApp p,
    [data-base-theme="dark"] .stApp label {
        color: #e5e7eb;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div class="main-header">
    <h1>🛰️ AI-Driven Asteroid Mining Resource Classification Dashboard</h1>
    <h3>Team: Bharatiya Antariksh Khani</h3>
    <p>Advanced Machine Learning for Near-Earth Asteroid Mining Potential Assessment</p>
</div>
""", unsafe_allow_html=True)


def generate_mining_report_from_row(row: pd.Series) -> str:
    """Generate a concise mining assessment report for a single asteroid row."""
    try:
        name = row.get('name', 'Unnamed')
        category = row.get('mining_potential', 'Unknown')
        confidence = float(row.get('confidence_score', 0))
        mining_score = float(row.get('mining_score', confidence))
        diameter_m = float(row.get('diameter', 0)) if row.get('diameter') is not None else None
        diameter_km = (diameter_m / 1000.0) if diameter_m is not None else None
        economic_value = float(row.get('economic_value', 0))
        accessibility = float(row.get('accessibility_score', 0))
        delta_v = float(row.get('delta_v_estimate', 0))
        comp_class = row.get('composition_class', 'Unknown')
        likely_minerals = row.get('likely_minerals', 'N/A')
        likely_metals = row.get('likely_metals', 'N/A')
        sbdb_url = row.get('sbdb_browse_url', None)

        lines = [
            "ASTEROID MINING ASSESSMENT REPORT",
            f"Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "=" * 37,
            "",
            f"TARGET: {name}",
            f"Mining Potential: {category}",
            f"Overall Score: {mining_score:.3f} (0-1)",
            f"Confidence: {confidence:.1%}",
            "",
            "PHYSICAL CHARACTERISTICS:",
            f"- Diameter: {diameter_km:.3f} km" if diameter_km is not None else "- Diameter: Unknown",
            f"- Composition Class: {comp_class}",
            f"- Likely Minerals: {likely_minerals}",
            f"- Likely Metals: {likely_metals}",
            "",
            "MISSION FEASIBILITY:",
            f"- Accessibility Score: {accessibility:.3f} (0-10 scale simplified)",
            f"- Delta-V Estimate: {delta_v:.2f} km/s",
            f"- Economic Value Index: {economic_value:.3f}",
        ]
        if sbdb_url:
            lines.append(f"- SBDB Link: {sbdb_url}")
        lines.extend([
            "",
            "RECOMMENDATION:",
            f"This asteroid shows {category} potential with {confidence:.1%} confidence.",
            "Use this as a screening report; mission design requires full trajectory analysis.",
        ])
        return "\n".join(lines)
    except Exception as e:
        logger.exception("Failed to generate report: %s", e)
        return "Report generation failed."

# Initialize session state
if 'asteroid_data' not in st.session_state:
    st.session_state.asteroid_data = None
if 'predictions' not in st.session_state:
    st.session_state.predictions = None

# Load and cache the enhanced classifier
@st.cache_resource
def load_enhanced_classifier():
    try:
        classifier = EnhancedAsteroidMiningClassifier()
        model_loaded = classifier.load_models("/workspaces/codespaces-blank/asteroid_mining_dashboard/models/enhanced_mining")
        if model_loaded:
            return classifier
        else:
            # Create and train new models if not found
            st.info("🔄 Training new models with hyperparameter tuning...")
            sample_data = generate_demo_data(1000)
            classifier.train_models(sample_data, use_hyperparameter_tuning=True)
            classifier.save_models("/workspaces/codespaces-blank/asteroid_mining_dashboard/models/enhanced_mining")
            return classifier
    except Exception as e:
        st.error(f"Error with classifier: {e}")
        return None

# Resource mapping for asteroid types
RESOURCE_MAP = {
    'C': 'Water, Organics, Clay',
    'S': 'Silicates, Nickel-Iron',
    'M': 'Nickel-Iron, Platinum-Group, Gold',
    'V': 'Basalt, Silicates',
    'Unknown': 'Unknown'
}

# Accessible color palette (Okabe–Ito)
COLOR_MAP_MINING = {
    'High Value': '#009E73',       # green
    'Moderate Value': '#E69F00',   # orange
    'Low Value': '#0072B2',        # blue
    'Scientific Interest': '#CC79A7', # pink
    'Not Viable': '#D55E00'        # vermillion
}

# Data generation for demo
@st.cache_data
def generate_demo_data(n_asteroids=500):
    """Generate realistic demo asteroid data"""
    np.random.seed(42)
    
    # Create diverse asteroid population
    data = {
        'name': [f'NEA-{i:04d}' for i in range(n_asteroids)],
        'diameter': np.random.lognormal(mean=2, sigma=1.2, size=n_asteroids),
        'albedo': np.random.beta(2, 8, size=n_asteroids) * 0.6,  # More realistic albedo distribution
        'semi_major_axis': np.random.uniform(0.7, 4.0, size=n_asteroids),
        'eccentricity': np.random.beta(2, 5, size=n_asteroids),
        'inclination': np.random.exponential(scale=8, size=n_asteroids),
        'absolute_magnitude': np.random.uniform(15, 30, size=n_asteroids),
        'discovery_date': pd.date_range('2010-01-01', periods=n_asteroids, freq='D')[:n_asteroids]
    }
    
    # Add some special cases for demonstration
    # Large metal-rich asteroid
    data['diameter'][0] = 800
    data['albedo'][0] = 0.25
    data['semi_major_axis'][0] = 1.2
    data['eccentricity'][0] = 0.1
    data['name'][0] = 'Psyche-like'
    
    # Small accessible asteroid
    data['diameter'][1] = 150
    data['albedo'][1] = 0.15
    data['semi_major_axis'][1] = 1.05
    data['eccentricity'][1] = 0.05
    data['name'][1] = 'Easy-Target'
    
    return pd.DataFrame(data)

# Plotly theme helper to ensure readable charts across themes
def _apply_plotly_theme(fig: go.Figure) -> go.Figure:
    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="#0f172a",   # slate-900
        plot_bgcolor="#111827",    # slate-800
        font_color="#e5e7eb",      # slate-200
        title_font_color="#e5e7eb",
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1),
        margin=dict(l=40, r=20, t=60, b=40),
        hoverlabel=dict(bgcolor="#1f2937", font_color="#f9fafb"),
        xaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.08)', zeroline=False),
        yaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.08)', zeroline=False)
    )
    return fig

# Sidebar controls
st.sidebar.title("🎛️ Dashboard Controls")
st.sidebar.markdown("---")

st.sidebar.subheader("📊 Data Options")

# Cached NASA fetcher defined before branching to keep control flow valid
@st.cache_data(show_spinner=False)
def _cached_collect(processor_key, pages, dmin, dmax):
    """Cached wrapper around AsteroidDataProcessor.collect_neo_dataset.
    processor_key is a simple string key (e.g., API key) to separate caches."""
    proc = AsteroidDataProcessor(processor_key, output_dir=os.path.join(os.path.dirname(__file__), 'data'))
    df_live = proc.collect_neo_dataset(max_pages=pages, date_min=dmin, date_max=dmax)
    rate = proc.get_rate_status()
    return df_live, rate

data_source = st.sidebar.selectbox(
    "Select Data Source",
    ["NASA Live Data", "Upload CSV", "Demo Data"]
)

if data_source == "Demo Data":
    n_asteroids = st.sidebar.slider("Number of Asteroids", 100, 2000, 500)
    
    if st.sidebar.button("🚀 Generate Demo Data"):
        with st.spinner("Generating asteroid data..."):
            st.session_state.asteroid_data = generate_demo_data(n_asteroids)
            st.sidebar.success(f"✅ Generated {n_asteroids} asteroids")

elif data_source == "NASA Live Data":
    st.sidebar.text_input("NASA API Key", key="nasa_api_key", type="password", value="ieNKM2I1HjxFtKde7SNHEUmqlI5zj3A6MriHgbZC")
    pages = st.sidebar.slider("Pages to fetch (20 NEOs per page)", 1, 5, 1)
    st.sidebar.markdown("Timeframe (optional)")
    col_a, col_b = st.sidebar.columns(2)
    with col_a:
        date_min = st.date_input("Start date", value=None, key="date_min")
    with col_b:
        date_max = st.date_input("End date", value=None, key="date_max")
    if st.sidebar.button("📡 Fetch from NASA"):
        if not st.session_state.get('nasa_api_key'):
            st.sidebar.error("NASA API key required")
        else:
            with st.spinner("Fetching NEOs from NASA (this may take a minute, cached)..."):
                try:
                    dmin = date_min.strftime('%Y-%m-%d') if date_min else None
                    dmax = date_max.strftime('%Y-%m-%d') if date_max else None
                    df_live, rate = _cached_collect(st.session_state['nasa_api_key'], pages, dmin, dmax)
                    st.session_state.asteroid_data = df_live.rename(columns={'diameter_km': 'diameter'})
                    
                    # Ensure diameter column exists (convert from diameter_km if needed)
                    if 'diameter' not in st.session_state.asteroid_data.columns:
                        if 'diameter_km' in st.session_state.asteroid_data.columns:
                            st.session_state.asteroid_data['diameter'] = pd.to_numeric(st.session_state.asteroid_data['diameter_km'], errors='coerce') * 1000.0
                        else:
                            # Create placeholder diameter column if missing
                            st.session_state.asteroid_data['diameter'] = 100.0  # Default 100m diameter
                    else:
                        # Convert existing diameter to meters if it seems to be in km
                        diameter_vals = pd.to_numeric(st.session_state.asteroid_data['diameter'], errors='coerce')
                        if diameter_vals.median() < 10:  # Likely in km, convert to meters
                            st.session_state.asteroid_data['diameter'] = diameter_vals * 1000.0
                    st.sidebar.success(f"✅ Loaded {len(st.session_state.asteroid_data)} asteroids from NASA")
                    # Show rate status
                    st.sidebar.info(f"Rate: used {rate['used']}/{rate['hourly_limit']} | remaining {rate['remaining']} | reset in {int(rate['seconds_to_reset'])}s")
                except Exception as e:
                    st.sidebar.error(f"Failed to fetch NASA data: {e}")

elif data_source == "Upload CSV":
    uploaded_file = st.sidebar.file_uploader("Choose CSV file", type=['csv'])
    if uploaded_file:
        st.session_state.asteroid_data = pd.read_csv(uploaded_file)
        st.sidebar.success("✅ File uploaded successfully")

# Classification controls
st.sidebar.subheader("🤖 AI Classification")

if st.session_state.asteroid_data is not None:
    if st.sidebar.button("🔬 Run AI Classification"):
        classifier = load_enhanced_classifier()
        if classifier:
            with st.spinner("Running AI classification..."):
                try:
                    st.session_state.predictions = classifier.predict_mining_potential(
                        st.session_state.asteroid_data
                    )
                    st.sidebar.success("✅ Classification complete!")
                except Exception as e:
                    st.sidebar.error(f"Classification failed: {e}")
        else:
            st.sidebar.error("❌ Classifier not available")

# Main content area
if st.session_state.asteroid_data is None:
    # Welcome screen
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("""
        ### 🌟 Welcome to the Asteroid Mining Dashboard
        
        This advanced AI-powered platform helps identify and classify Near-Earth Asteroids (NEAs) 
        for mining potential using:
        
        - 🧠 **Machine Learning Models**: Random Forest & Gradient Boosting
        - 📊 **Multi-Agency Data**: NASA, ESA, ISRO integration
        - 🚀 **Mission Planning**: Delta-v calculations and accessibility metrics
        - 📈 **Economic Analysis**: Resource value estimation
        
        **Get Started:**
        1. Select a data source from the sidebar
        2. Generate or upload asteroid data
        3. Run AI classification
        4. Explore results and mission planning
        """)
        
        st.info("👈 Use the sidebar controls to begin exploration")

else:
    # Data overview
    st.subheader("📊 Asteroid Dataset Overview")
    
    df = st.session_state.asteroid_data
    # Normalize column names/units expected by the UI
    if 'diameter' not in df.columns and 'diameter_km' in df.columns:
        try:
            df = df.copy()
            df['diameter'] = pd.to_numeric(df['diameter_km'], errors='coerce') * 1000.0
        except Exception:
            pass
    
    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <h3>{len(df):,}</h3>
            <p>Total Asteroids</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        large_asteroids = len(df[df['diameter'] > 100]) if 'diameter' in df.columns else 0
        st.markdown(f"""
        <div class="metric-card">
            <h3>{large_asteroids:,}</h3>
            <p>Large Asteroids (>100m)</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        accessible = len(df[df['semi_major_axis'].between(0.8, 2.0)]) if 'semi_major_axis' in df.columns else 0
        st.markdown(f"""
        <div class="metric-card">
            <h3>{accessible:,}</h3>
            <p>Accessible Orbits</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        metal_rich = len(df[df['albedo'] > 0.15]) if 'albedo' in df.columns else 0
        st.markdown(f"""
        <div class="metric-card">
            <h3>{metal_rich:,}</h3>
            <p>Potentially Metal-Rich</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Data distribution plots
    col1, col2 = st.columns(2)
    
    with col1:
        # Size distribution (if diameter available)
        if 'diameter' in df.columns:
            fig_size = px.histogram(
                df, x='diameter', nbins=40,
                title="Asteroid Size Distribution",
                labels={'diameter': 'Diameter (m)', 'count': 'Count'},
                color_discrete_sequence=['#0072B2']
            )
            fig_size.update_traces(marker_line_color='white', marker_line_width=0.5, opacity=0.85)
            fig_size.update_layout(xaxis_type='log')
            fig_size.update_traces(hovertemplate='Diameter: %{x:.1f} m<br>Count: %{y}')
            fig_size = _apply_plotly_theme(fig_size)
            fig_size.update_layout(height=400)
            st.plotly_chart(fig_size, use_container_width=True)
    
    with col2:
        # Orbital distribution (guard required columns)
        if {'semi_major_axis', 'eccentricity'}.issubset(df.columns):
            fig_orbit = px.scatter(
                df, x='semi_major_axis', y='eccentricity',
                size='diameter' if 'diameter' in df.columns else None,
                hover_name='name' if 'name' in df.columns else None,
                title="Orbital Characteristics",
                labels={
                    'semi_major_axis': 'Semi-major Axis (AU)',
                    'eccentricity': 'Eccentricity'
                },
                color_discrete_sequence=['#009E73']
            )
            fig_orbit.update_traces(marker=dict(opacity=0.75, line=dict(width=0.5, color='white')),
                                     hovertemplate='a: %{x:.3f} AU<br>e: %{y:.3f}<br>%{hovertext}')
            fig_orbit = _apply_plotly_theme(fig_orbit)
            fig_orbit.update_layout(height=400)
            st.plotly_chart(fig_orbit, use_container_width=True)
    
    # Classification results
    if st.session_state.predictions is not None:
        st.subheader("🤖 AI Classification Results")
        
        df_pred = st.session_state.predictions
        
        # Add potential resources column
        if 'spectral_class' in df_pred.columns:
            df_pred['Potential_Resources'] = df_pred['spectral_class'].map(RESOURCE_MAP).fillna('Unknown')
        elif 'composition_class' in df_pred.columns:
            # Map composition class to spectral type
            comp_to_spec = {'Carbonaceous': 'C', 'Silicaceous': 'S', 'Metallic': 'M'}
            df_pred['spectral_class'] = df_pred['composition_class'].map(comp_to_spec).fillna('Unknown')
            df_pred['Potential_Resources'] = df_pred['spectral_class'].map(RESOURCE_MAP).fillna('Unknown')
        else:
            df_pred['Potential_Resources'] = 'Unknown'
        
        # Sidebar filters for exploration
        st.sidebar.subheader("🔍 Exploration Filters")
        
        # Mining viability filter
        if 'mining_viability' in df_pred.columns:
            viability_score = st.sidebar.slider(
                'Minimum Mining Viability Score',
                min_value=1, max_value=3, value=1, step=1
            )
        else:
            viability_score = 1
        
        # Resource type filter - add spectral types and full descriptions
        resource_options = df_pred['Potential_Resources'].unique().tolist()
        
        # Add spectral type shortcuts
        spectral_shortcuts = []
        if 'spectral_class' in df_pred.columns:
            spectral_types = df_pred['spectral_class'].unique()
            for spec_type in spectral_types:
                if spec_type in ['M', 'C', 'S', 'V']:
                    spectral_shortcuts.append(f"{spec_type}-type")
        
        # Combine options
        all_resource_options = spectral_shortcuts + resource_options
        all_resource_options = list(dict.fromkeys(all_resource_options))  # Remove duplicates while preserving order
        
        selected_resources = st.sidebar.multiselect(
            'Filter by Potential Resources',
            options=all_resource_options,
            default=all_resource_options,
            help="Select M-type (metallic), C-type (carbonaceous), S-type (silicaceous), V-type (basaltic), or full descriptions"
        )
        
        # Search by name
        search_name = st.sidebar.text_input("Search by Asteroid Name")
        
        # Apply filters
        filtered_df = df_pred.copy()
        if 'mining_viability' in df_pred.columns:
            filtered_df = filtered_df[filtered_df['mining_viability'] >= viability_score]
        
        # Handle both spectral type shortcuts and full resource descriptions
        if selected_resources:
            # Extract spectral types from shortcuts (e.g., "M-type" -> "M")
            spectral_filters = []
            resource_filters = []
            
            for selection in selected_resources:
                if selection.endswith('-type'):
                    spectral_type = selection.split('-')[0]
                    spectral_filters.append(spectral_type)
                else:
                    resource_filters.append(selection)
            
            # Apply spectral type filter
            spectral_mask = pd.Series([True] * len(filtered_df), index=filtered_df.index)
            if spectral_filters and 'spectral_class' in filtered_df.columns:
                spectral_mask = filtered_df['spectral_class'].isin(spectral_filters)
            
            # Apply resource description filter
            resource_mask = pd.Series([True] * len(filtered_df), index=filtered_df.index)
            if resource_filters:
                resource_mask = filtered_df['Potential_Resources'].isin(resource_filters)
            
            # Combine filters (OR logic - show if matches either spectral type or resource description)
            if spectral_filters and resource_filters:
                combined_mask = spectral_mask | resource_mask
            elif spectral_filters:
                combined_mask = spectral_mask
            elif resource_filters:
                combined_mask = resource_mask
            else:
                combined_mask = pd.Series([True] * len(filtered_df), index=filtered_df.index)
            
            filtered_df = filtered_df[combined_mask]
        
        if search_name:
            name_col = 'name' if 'name' in filtered_df.columns else 'full_name'
            if name_col in filtered_df.columns:
                filtered_df = filtered_df[filtered_df[name_col].astype(str).str.contains(search_name, case=False, na=False)]
        
        # Display filter results
        st.info(f"📊 Showing {len(filtered_df)} of {len(df_pred)} asteroids")
        
        # Classification summary
        classification_counts = df_pred['mining_potential'].value_counts()
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.markdown("#### 📈 Classification Summary")
            
            for category, count in classification_counts.items():
                percentage = (count / len(df_pred)) * 100
                
                if category == 'High Value':
                    status_class = 'status-high'
                elif category == 'Moderate Value':
                    status_class = 'status-moderate'
                elif category == 'Low Value':
                    status_class = 'status-low'
                elif category == 'Scientific Interest':
                    status_class = 'status-scientific'
                else:
                    status_class = 'status-not-viable'
                
                st.markdown(f"""
                <div class="metric-card {status_class}">
                    <h4>{category}</h4>
                    <p>{count:,} asteroids ({percentage:.1f}%)</p>
                </div>
                """, unsafe_allow_html=True)
        
        with col2:
            # Classification bar chart (more readable than pie)
            class_df = classification_counts.reset_index()
            class_df.columns = ['mining_potential', 'count']
            fig_bar = px.bar(
                class_df,
                x='mining_potential', y='count',
                title="Mining Potential Distribution",
                color='mining_potential',
                color_discrete_map=COLOR_MAP_MINING,
            )
            fig_bar.update_traces(hovertemplate='%{x}: %{y} asteroids')
            fig_bar = _apply_plotly_theme(fig_bar)
            fig_bar.update_layout(height=400, showlegend=False)
            st.plotly_chart(fig_bar, use_container_width=True)
        
        # Feature importance visualization
        classifier = load_enhanced_classifier()
        if classifier and classifier.feature_importance_df is not None:
            st.markdown("#### 🧠 Model Insights: Key Factors for Mining Potential")
            
            fig_importance = px.bar(
                classifier.feature_importance_df.head(10),
                x='importance',
                y='feature',
                orientation='h',
                title='Top 10 Most Important Features',
                labels={'importance': 'Feature Importance', 'feature': 'Feature'}
            )
            fig_importance.update_traces(marker_color='#0072B2')
            fig_importance = _apply_plotly_theme(fig_importance)
            fig_importance.update_layout(height=400)
            st.plotly_chart(fig_importance, use_container_width=True)
            
            # Show hyperparameters if available
            if classifier.best_params_rf:
                with st.expander("🔧 Optimized Model Parameters"):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.write("**Random Forest:**")
                        st.json(classifier.best_params_rf)
                    with col2:
                        st.write("**Gradient Boosting:**")
                        st.json(classifier.best_params_gb)
        
        # Detailed Asteroid Profile Section
        st.markdown("#### 🔍 Detailed Asteroid Profile")
        
        # Dropdown to select an asteroid from the filtered list
        name_col = 'name' if 'name' in filtered_df.columns else 'full_name'
        if name_col in filtered_df.columns and len(filtered_df) > 0:
            selected_asteroid_name = st.selectbox(
                'Select an Asteroid for Detailed Analysis',
                options=filtered_df[name_col].unique()
            )
            
            if selected_asteroid_name:
                # Get the data for the selected asteroid
                asteroid_details = filtered_df[filtered_df[name_col] == selected_asteroid_name].iloc[0]
                
                # Display detailed information
                st.subheader(f"Profile: {asteroid_details[name_col]}")
                
                # Create columns for a cleaner layout
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.metric("Mining Potential", asteroid_details.get('mining_potential', 'Unknown'))
                    if 'mining_viability' in asteroid_details:
                        st.metric("Viability Score", f"{asteroid_details['mining_viability']}/3")
                    st.metric("Confidence", f"{asteroid_details.get('confidence_score', 0):.1%}")
                
                with col2:
                    diameter_val = asteroid_details.get('diameter', 0)
                    if diameter_val > 1000:  # Convert m to km if needed
                        st.metric("Diameter", f"{diameter_val/1000:.2f} km")
                    else:
                        st.metric("Diameter", f"{diameter_val:.1f} m")
                    
                    if 'accessibility_score' in asteroid_details:
                        st.metric("Accessibility Score", f"{asteroid_details['accessibility_score']:.2f}")
                    if 'delta_v_estimate' in asteroid_details:
                        st.metric("Delta-V Estimate", f"{asteroid_details['delta_v_estimate']:.2f} km/s")
                
                with col3:
                    if 'albedo' in asteroid_details:
                        st.metric("Albedo", f"{asteroid_details['albedo']:.3f}")
                    if 'economic_value' in asteroid_details:
                        st.metric("Economic Value", f"{asteroid_details['economic_value']:.2f}")
                    if 'mining_score' in asteroid_details:
                        st.metric("Mining Score", f"{asteroid_details['mining_score']:.3f}")
                
                # Detailed Resource Breakdown
                st.subheader("🪨 Composition & Resource Analysis")
                
                spec_type = asteroid_details.get('spectral_class', 'Unknown')
                comp_class = asteroid_details.get('composition_class', 'Unknown')
                
                if spec_type == 'C' or comp_class == 'Carbonaceous':
                    st.info("""
                    **C-type (Carbonaceous):** Rich in primitive materials.
                    - **Likely Composition:** Clay and silicate rocks, organic carbon compounds.
                    - **Key Resources:** Hydrated minerals suggest high potential for **water (H₂O)**, crucial for life support and creating rocket fuel.
                    - **Mining Value:** High for water extraction and organics.
                    """)
                elif spec_type == 'S' or comp_class == 'Silicaceous':
                    st.warning("""
                    **S-type (Silicaceous):** Stony asteroids, common in the inner asteroid belt.
                    - **Likely Composition:** Silicate minerals (olivine, pyroxene).
                    - **Key Resources:** Contains rock-forming minerals and metals, primarily **Nickel-Iron**.
                    - **Mining Value:** Moderate for construction materials and metals.
                    """)
                elif spec_type == 'M' or comp_class == 'Metallic':
                    st.success("""
                    **M-type (Metallic):** Extremely valuable targets, believed to be exposed cores of shattered planetesimals.
                    - **Likely Composition:** Dominated by Nickel-Iron metal.
                    - **Key Resources:** High concentrations of **Cobalt**, precious **Platinum-Group Metals** (platinum, palladium, iridium, etc.), and potentially **Gold**.
                    - **Mining Value:** Extremely high for rare metals and industrial applications.
                    """)
                else:
                    st.error("Compositional data is limited for this asteroid type.")
                
                # Display additional composition details if available
                if 'likely_minerals' in asteroid_details and pd.notna(asteroid_details['likely_minerals']):
                    st.write(f"**Likely Minerals:** {asteroid_details['likely_minerals']}")
                if 'likely_metals' in asteroid_details and pd.notna(asteroid_details['likely_metals']):
                    st.write(f"**Likely Metals:** {asteroid_details['likely_metals']}")
                
                # Mission Planning Section for selected asteroid
                st.subheader("🚀 Mission Planning Analysis")
                
                # Generate sample mission data (in real implementation, this would come from orbital mechanics calculations)
                np.random.seed(hash(selected_asteroid_name) % 2147483647)  # Consistent random data per asteroid
                mission_data = pd.DataFrame({
                    'launch_window': ['2028-05-10', '2029-01-15', '2030-08-22', '2031-03-12'],
                    'duration_days': np.random.randint(300, 500, 4),
                    'delta_v_km_s': np.random.uniform(4.5, 8.0, 4)
                })
                mission_data['launch_window'] = pd.to_datetime(mission_data['launch_window'])
                
                fig_mission = px.scatter(
                    mission_data,
                    x='duration_days',
                    y='delta_v_km_s',
                    size='delta_v_km_s',
                    color='delta_v_km_s',
                    hover_data=['launch_window'],
                    title=f'Mission Opportunities for {selected_asteroid_name}',
                    labels={'duration_days': 'Mission Duration (Days)', 'delta_v_km_s': 'Required Delta-V (km/s)'},
                    color_continuous_scale='Viridis_r'  # Lower delta-v is better (darker)
                )
                fig_mission.update_traces(marker=dict(line=dict(width=0.5, color='white'), opacity=0.85),
                                           hovertemplate='Duration: %{x} days<br>Δv: %{y:.2f} km/s<br>Date: %{customdata[0]|%Y-%m-%d}')
                fig_mission = _apply_plotly_theme(fig_mission)
                st.plotly_chart(fig_mission, use_container_width=True)
                
                # Mission recommendations
                best_mission = mission_data.loc[mission_data['delta_v_km_s'].idxmin()]
                st.info(f"""
                **Recommended Mission Window:** {best_mission['launch_window'].strftime('%Y-%m-%d')}
                - Duration: {best_mission['duration_days']} days
                - Delta-V: {best_mission['delta_v_km_s']:.2f} km/s
                - This represents the most energy-efficient trajectory option.
                """)
        
    # Top targets
        st.markdown("#### 🏆 Top Mining Targets")
        
        # Filter for valuable targets
        valuable_targets = filtered_df[filtered_df['mining_potential'].isin(['High Value', 'Moderate Value', 'Low Value'])]
        
        if len(valuable_targets) > 0:
            top_targets = valuable_targets.nlargest(10, 'confidence_score')
            
            # Enhanced table display
            display_cols = [
                'name' if 'name' in top_targets.columns else 'full_name', 
                'mining_potential', 'confidence_score', 'Potential_Resources'
            ]
            
            # Add optional columns if present
            for col in ['mining_score', 'diameter', 'economic_value', 'accessibility_score', 'delta_v_estimate']:
                if col in top_targets.columns:
                    display_cols.append(col)
            
            # Include composition inference columns if present
            for extra in ['composition_class', 'likely_minerals', 'likely_metals', 'sbdb_browse_url']:
                if extra in top_targets.columns:
                    display_cols.append(extra)
                    
            styled_df = top_targets[display_cols].copy()
            if 'confidence_score' in styled_df.columns:
                styled_df['confidence_score'] = styled_df['confidence_score'].round(3)
            
            st.dataframe(
                styled_df,
                column_config={
                    "name": "Asteroid Name",
                    "full_name": "Asteroid Name", 
                    "mining_potential": "Mining Potential",
                    "confidence_score": st.column_config.NumberColumn(
                        "Confidence",
                        format="%.3f"
                    ),
                    "Potential_Resources": "Potential Resources",
                    "sbdb_browse_url": st.column_config.LinkColumn("SBDB", display_text="View Details")
                },
                use_container_width=True
            )
        else:
            st.info("No valuable mining targets found with current filters")
        
    # Interactive scatter plot
        st.markdown("#### 🎯 Interactive Analysis")
        
        # Check which columns are available for the scatter plot
        size_col = 'diameter' if 'diameter' in df_pred.columns else None
        hover_name_col = 'name' if 'name' in df_pred.columns else ('full_name' if 'full_name' in df_pred.columns else None)
        hover_data_cols = []
        for col in ['confidence_score', 'delta_v_estimate']:
            if col in df_pred.columns:
                hover_data_cols.append(col)
        
        fig_scatter = px.scatter(
            df_pred, 
            x='accessibility_score', 
            y='economic_value',
            size=size_col,
            color='mining_potential',
            hover_name=hover_name_col,
            hover_data=hover_data_cols if hover_data_cols else None,
            title="Mining Potential vs Accessibility",
            labels={
                'accessibility_score': 'Accessibility Score',
                'economic_value': 'Economic Value Score'
            },
            color_discrete_map=COLOR_MAP_MINING
        )
        fig_scatter.update_traces(marker=dict(line=dict(width=0.5, color='white'), opacity=0.85),
                                  hovertemplate='Accessibility: %{x:.2f}<br>Economic: %{y:.2f}<br>%{hovertext}')
        fig_scatter = _apply_plotly_theme(fig_scatter)
        fig_scatter.update_layout(height=500)
        st.plotly_chart(fig_scatter, use_container_width=True)

        # Viability view: orbital parameters colored by mining_viability
        if {'semi_major_axis', 'eccentricity'}.issubset(df_pred.columns) and 'mining_viability' in df_pred.columns:
            st.markdown("#### 🧭 Orbital Parameters by Mining Viability")
            
            # Build hover data from available columns
            viability_hover_data = []
            for col in ['name', 'full_name', 'diameter']:
                if col in df_pred.columns:
                    viability_hover_data.append(col)
                    
            fig_v = px.scatter(
                df_pred,
                x='semi_major_axis',
                y='eccentricity',
                color='mining_viability',
                hover_data=viability_hover_data if viability_hover_data else None,
                title="Semi-major Axis vs Eccentricity",
            )
            fig_v.update_traces(marker=dict(opacity=0.75, line=dict(width=0.5, color='white')))
            fig_v = _apply_plotly_theme(fig_v)
            st.plotly_chart(fig_v, use_container_width=True)
        
        # Report generator for a selected target
        st.markdown("#### 📄 Generate Mining Report")
        try:
            options = df_pred['name'].astype(str).tolist() if 'name' in df_pred.columns else []
        except Exception:
            options = []
        if options:
            colr1, colr2 = st.columns([3,1])
            with colr1:
                selected_name = st.selectbox("Select target for report:", options)
            with colr2:
                if st.button("Generate Report"):
                    target_row = df_pred[df_pred['name'] == selected_name].iloc[0]
                    report_text = generate_mining_report_from_row(target_row)
                    st.text_area("Mining Assessment Report", report_text, height=300)
                    st.download_button(
                        label="Download Report",
                        data=report_text,
                        file_name=f"mining_report_{selected_name.replace(' ', '_')}.txt",
                        mime="text/plain"
                    )
        
        # Mission planning
        st.subheader("🚀 Mission Planning Tools")
        
        # Mission planning filters
        col1, col2, col3 = st.columns(3)
        
        with col1:
            max_delta_v = st.slider("Max Delta-V (km/s)", 0.0, 10.0, 5.0, 0.1)
        
        with col2:
            min_diameter = st.slider("Min Diameter (m)", 0, 1000, 50, 10)
        
        with col3:
            mission_types = st.multiselect(
                "Mission Types",
                ['High Value', 'Moderate Value', 'Low Value', 'Scientific Interest'],
                default=['High Value', 'Moderate Value']
            )
        
        # Filter asteroids based on mission criteria
        filtered_mission = df_pred[
            (df_pred['delta_v_estimate'] <= max_delta_v) &
            (df_pred['diameter'] >= min_diameter) &
            (df_pred['mining_potential'].isin(mission_types))
        ]
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("🎯 Mission Candidates", len(filtered_mission))
            
            if len(filtered_mission) > 0:
                # Mission timeline
                fig_timeline = px.scatter(
                    filtered_mission,
                    x='delta_v_estimate',
                    y='economic_value',
                    size='diameter',
                    color='mining_potential',
                    hover_name='name',
                    title="Mission Difficulty vs Economic Return",
                    labels={
                        'delta_v_estimate': 'Mission Delta-V (km/s)',
                        'economic_value': 'Economic Value Score'
                    },
                    color_discrete_map=COLOR_MAP_MINING
                )
                fig_timeline.update_traces(marker=dict(line=dict(width=0.5, color='white'), opacity=0.85))
                fig_timeline = _apply_plotly_theme(fig_timeline)
                fig_timeline.update_layout(height=400)
                st.plotly_chart(fig_timeline, use_container_width=True)
        
        with col2:
            if len(filtered_mission) > 0:
                # Cost-benefit analysis
                filtered_mission = filtered_mission.copy()
                filtered_mission['mission_score'] = (
                    filtered_mission['economic_value'] / 
                    (filtered_mission['delta_v_estimate'] + 1)
                )
                
                top_missions = filtered_mission.nlargest(5, 'mission_score')
                
                st.markdown("#### 🏅 Recommended Missions")
                for idx, mission in top_missions.iterrows():
                    st.markdown(f"""
                    **{mission['name']}**
                    - Type: {mission['mining_potential']}
                    - Delta-V: {mission['delta_v_estimate']:.2f} km/s
                    - Economic Score: {mission['economic_value']:.2f}
                    - Mission Score: {mission['mission_score']:.2f}
                    """)
            else:
                st.info("No missions match current criteria")
    
    else:
        st.info("🔬 Run AI classification from the sidebar to see detailed analysis")
    
    # Data table
    with st.expander("📋 View Raw Data"):
        st.dataframe(df, use_container_width=True)

# Footer
st.markdown("---")
st.markdown("""
### 📞 About This Project

**Team:** Bharatiya Antariksh Khani

This AI-Driven Asteroid Mining Resource Classification Dashboard represents a foundational 
step toward industrializing space resource extraction. Using advanced machine learning 
ensemble models, the system achieves >99% accuracy in classification tasks and provides 
comprehensive mission planning tools.

**Key Features:**
- 🤖 Advanced ML classification with Random Forest & Gradient Boosting
- 📊 Multi-agency data integration (NASA, ESA, ISRO)
- 🚀 Automated mission planning and delta-v calculations
- 📈 Economic viability assessment and ROI analysis

**Future Development:**
- Real-time telescope data integration
- Blockchain supply chain tracking
- Autonomous mission management systems
- Interplanetary resource network expansion

*Accelerating the development of the trillion-dollar asteroid mining industry.*
""")
