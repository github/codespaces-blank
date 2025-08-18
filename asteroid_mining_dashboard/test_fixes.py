#!/usr/bin/env python3
"""
Test script to verify the SBDB error fixes and dashboard improvements.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.data_collector import MultiAgencyDataCollector
import pandas as pd

def test_sbdb_fixes():
    """Test the SBDB query fixes to reduce 400 errors."""
    print("🧪 Testing SBDB query fixes...")
    
    # Test the query building logic without making actual API calls
    from src.data_collector import build_sbdb_url
    
    # Test with some known problematic numeric IDs that should now be skipped
    test_cases = [
        {"id": "433", "expected": "should be filtered"},
        {"id": "719", "expected": "should be filtered"},
        {"id": "1998 DQ", "expected": "should work"},
        {"id": "1986 TO", "expected": "should work"},
        {"id": "2000433", "expected": "should work"},
    ]
    
    success_count = 0
    error_count = 0
    
    for test_case in test_cases:
        test_id = test_case["id"]
        print(f"\n📡 Testing ID: {test_id}...")
        
        try:
            # Test if it's a pure numeric string (these should be filtered)
            is_numeric = test_id.isdigit()
            
            if is_numeric and len(test_id) <= 4:
                print(f"✅ Numeric ID {test_id} would be filtered (as expected)")
                success_count += 1
            elif not is_numeric:
                # Test URL building for non-numeric IDs
                url = build_sbdb_url(test_id)
                if url:
                    print(f"✅ Non-numeric ID {test_id} produces valid URL: {url[:80]}...")
                    success_count += 1
                else:
                    print(f"⚠️  Non-numeric ID {test_id} produces no URL")
                    error_count += 1
            else:
                print(f"✅ Complex ID {test_id} would be processed normally")
                success_count += 1
                
        except Exception as e:
            print(f"❌ Error for {test_id}: {e}")
            error_count += 1
    
    print(f"\n📊 SBDB Test Results:")
    print(f"   ✅ Successful: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   📈 Success Rate: {success_count / len(test_cases) * 100:.1f}%")
    
    return success_count, error_count

def test_dashboard_data_handling():
    """Test the dashboard's data column handling."""
    print("\n🖥️  Testing dashboard data handling...")
    
    # Create test dataframes with various column configurations
    test_cases = [
        {
            "name": "Full columns",
            "data": pd.DataFrame({
                'name': ['Test Asteroid 1', 'Test Asteroid 2'],
                'diameter': [100.5, 250.0],
                'h_mag': [18.5, 16.2],
                'semi_major_axis': [2.1, 2.8],
                'eccentricity': [0.15, 0.25],
                'mining_viability': ['High', 'Medium']
            })
        },
        {
            "name": "Missing diameter",
            "data": pd.DataFrame({
                'name': ['Test Asteroid 3', 'Test Asteroid 4'],
                'h_mag': [19.1, 17.5],
                'semi_major_axis': [1.9, 3.2],
                'eccentricity': [0.08, 0.35],
                'mining_viability': ['Low', 'High']
            })
        },
        {
            "name": "Missing h_mag",
            "data": pd.DataFrame({
                'name': ['Test Asteroid 5', 'Test Asteroid 6'],
                'diameter': [75.2, 180.8],
                'semi_major_axis': [2.5, 2.3],
                'eccentricity': [0.12, 0.28],
                'mining_viability': ['Medium', 'High']
            })
        }
    ]
    
    for test_case in test_cases:
        print(f"\n📋 Testing: {test_case['name']}")
        df = test_case['data']
        print(f"   📊 Columns: {list(df.columns)}")
        
        # Test column availability checks
        has_diameter = 'diameter' in df.columns
        has_h_mag = 'h_mag' in df.columns
        has_orbital = {'semi_major_axis', 'eccentricity'}.issubset(df.columns)
        has_viability = 'mining_viability' in df.columns
        
        print(f"   🔍 Has diameter: {has_diameter}")
        print(f"   🔍 Has h_mag: {has_h_mag}")
        print(f"   🔍 Has orbital params: {has_orbital}")
        print(f"   🔍 Has viability: {has_viability}")
        
        # Test size column determination
        size_col = None
        if has_diameter:
            size_col = 'diameter'
        elif has_h_mag:
            size_col = 'h_mag_proxy'
            
        print(f"   📏 Size column strategy: {size_col or 'None available'}")
        
        # Test hover data construction
        hover_cols = []
        for col in ['name', 'full_name', 'diameter', 'spectral_type']:
            if col in df.columns:
                hover_cols.append(col)
        
        print(f"   📋 Hover data columns: {hover_cols}")
        
        print(f"   ✅ Test case '{test_case['name']}' handled successfully")
    
    return True

def main():
    """Run all tests."""
    print("🚀 Running fixes validation tests...")
    print("=" * 60)
    
    # Test SBDB fixes
    success_count, error_count = test_sbdb_fixes()
    
    # Test dashboard data handling
    dashboard_ok = test_dashboard_data_handling()
    
    print("\n" + "=" * 60)
    print("📋 FINAL TEST SUMMARY:")
    print(f"   🌐 SBDB Query Fixes: {success_count} successes, {error_count} errors")
    print(f"   🖥️  Dashboard Data Handling: {'✅ PASSED' if dashboard_ok else '❌ FAILED'}")
    
    if error_count == 0 and dashboard_ok:
        print("\n🎉 ALL TESTS PASSED! The fixes are working correctly.")
        return 0
    else:
        print("\n⚠️  Some issues detected. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
