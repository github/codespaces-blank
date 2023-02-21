"""
CS 5001
Homework 04
Pranchal Shah

This program tests the function is_valid_upc 
"""
import upc

def test_upc(case_number: int,upc_number : list, expected : bool):
    """_summary_ 
    This function tests the function is_valid_upc

    Args:
        case_number (int): Case number in int
        upc_number (list): list of integers to be checked
        expected (bool): True if expected to be valid, False otherwise

    Returns:
        print statement: Expected v/s Actual
    """
    actual = upc.is_valid_upc(upc_number)
    print(f"\nCase {case_number}: {upc_number} \nExpected: {expected} v/s Actual: {actual}")

def main():
    """
    _summary_
    This function calls the test upc function
    """
    # valid UPC numbers
    test_upc(0, [0,7,3,8,5,4,0,0,8,0,8,9], True)
    # Invalid UPC numbers
    test_upc(1, [1,2,3,4,5,6,7,8,9] , False)
    # All zeros
    test_upc(2, [0,0,0,0,0,0,0,0,0,0,0,0], False)
    # alternate 0s and 1s
    test_upc(3, [0,1,0,1,0,1,0,1,0,1,0,1], False)
    # more than 12 digits
    test_upc(4, [4,3,1,5,5,5,5,5,5,5,5,2,3,5,7,9], False)


if __name__ == "__main__":
    main()
