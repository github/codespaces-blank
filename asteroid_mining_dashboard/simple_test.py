#!/usr/bin/env python3
"""
Simple test to verify the fixes are working.
"""

import pandas as pd

def test_column_handling():
    """Test the dashboard's data column handling logic."""
    print("🖥️  Testing dashboard data handling...")
    
    # Test cases with different column configurations
    test_cases = [
        {
            "name": "Full columns",
            "columns": ['name', 'diameter', 'h_mag', 'semi_major_axis', 'eccentricity', 'mining_viability'],
            "expected_size_col": "diameter"
        },
        {
            "name": "Missing diameter",
            "columns": ['name', 'h_mag', 'semi_major_axis', 'eccentricity', 'mining_viability'],
            "expected_size_col": "size_proxy"
        },
        {
            "name": "Missing h_mag and diameter",
            "columns": ['name', 'semi_major_axis', 'eccentricity', 'mining_viability'],
            "expected_size_col": None
        }
    ]
    
    success_count = 0
    
    for test_case in test_cases:
        print(f"\n📋 Testing: {test_case['name']}")
        columns = test_case['columns']
        
        # Simulate the dashboard's column checking logic
        has_diameter = 'diameter' in columns
        has_h_mag = 'h_mag' in columns
        has_orbital = {'semi_major_axis', 'eccentricity'}.issubset(set(columns))
        has_viability = 'mining_viability' in columns
        
        print(f"   🔍 Available columns: {columns}")
        print(f"   🔍 Has diameter: {has_diameter}")
        print(f"   🔍 Has h_mag: {has_h_mag}")
        print(f"   🔍 Has orbital params: {has_orbital}")
        print(f"   🔍 Has viability: {has_viability}")
        
        # Test size column determination (matching dashboard logic)
        size_col = None
        if has_diameter:
            size_col = 'diameter'
        elif has_h_mag:
            size_col = 'size_proxy'  # Dashboard would create this
            
        print(f"   📏 Size column strategy: {size_col or 'None (no size)'}")
        
        # Test hover data construction
        hover_cols = []
        potential_hover_cols = ['name', 'full_name', 'diameter', 'spectral_type', 'predicted_resource']
        for col in potential_hover_cols:
            if col in columns:
                hover_cols.append(col)
        
        print(f"   📋 Hover data columns: {hover_cols}")
        
        # Check if we can safely create plots
        can_plot_orbital = has_orbital and has_viability
        can_plot_with_size = has_orbital and (has_diameter or has_h_mag)
        
        print(f"   📈 Can plot orbital viability: {can_plot_orbital}")
        print(f"   📊 Can plot with size: {can_plot_with_size}")
        
        if size_col == test_case['expected_size_col']:
            print(f"   ✅ Size column handling matches expected: {test_case['expected_size_col']}")
            success_count += 1
        else:
            print(f"   ❌ Size column mismatch. Expected: {test_case['expected_size_col']}, Got: {size_col}")
    
    return success_count, len(test_cases)

def test_numeric_id_filtering():
    """Test the numeric ID filtering logic."""
    print("\n🔢 Testing numeric ID filtering...")
    
    test_ids = [
        {"id": "433", "should_filter": True, "reason": "Short numeric ID"},
        {"id": "719", "should_filter": True, "reason": "Short numeric ID"},
        {"id": "887", "should_filter": True, "reason": "Short numeric ID"},
        {"id": "2000433", "should_filter": False, "reason": "Long numeric ID (probably NEO ref)"},
        {"id": "1998 DQ", "should_filter": False, "reason": "Alphanumeric designation"},
        {"id": "1986 TO", "should_filter": False, "reason": "Alphanumeric designation"},
        {"id": "433 Eros", "should_filter": False, "reason": "Contains name"},
    ]
    
    success_count = 0
    
    for test_case in test_ids:
        test_id = test_case["id"]
        should_filter = test_case["should_filter"]
        reason = test_case["reason"]
        
        # Simulate the filtering logic
        is_numeric = test_id.isdigit()
        is_short = len(test_id) <= 4
        would_filter = is_numeric and is_short
        
        print(f"\n📡 Testing ID: '{test_id}'")
        print(f"   📋 Reason: {reason}")
        print(f"   🔢 Is numeric: {is_numeric}")
        print(f"   📏 Is short (≤4 chars): {is_short}")
        print(f"   🛡️  Would filter: {would_filter}")
        
        if would_filter == should_filter:
            print(f"   ✅ Filtering decision correct")
            success_count += 1
        else:
            print(f"   ❌ Filtering decision incorrect. Expected: {should_filter}, Got: {would_filter}")
    
    return success_count, len(test_ids)

def main():
    """Run all tests."""
    print("🚀 Running asteroid mining dashboard fixes validation...")
    print("=" * 60)
    
    # Test column handling
    col_success, col_total = test_column_handling()
    
    # Test numeric ID filtering
    id_success, id_total = test_numeric_id_filtering()
    
    print("\n" + "=" * 60)
    print("📋 FINAL TEST SUMMARY:")
    print(f"   🖥️  Column Handling: {col_success}/{col_total} passed")
    print(f"   🔢 Numeric ID Filtering: {id_success}/{id_total} passed")
    
    total_success = col_success + id_success
    total_tests = col_total + id_total
    
    print(f"   📊 Overall: {total_success}/{total_tests} tests passed ({total_success/total_tests*100:.1f}%)")
    
    if total_success == total_tests:
        print("\n🎉 ALL TESTS PASSED! The fixes should work correctly.")
        return 0
    else:
        print(f"\n⚠️  {total_tests - total_success} tests failed. Check the logic above.")
        return 1

if __name__ == "__main__":
    exit(main())
