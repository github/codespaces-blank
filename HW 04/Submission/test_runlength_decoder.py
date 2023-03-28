"""
CS 5001
Homework 04
Pranchal Shah

This program is a test file for runlength_decoder.py
"""

import runlength_decoder as rl_decoder


def test_rl_decoder(data: list, expected: list)-> None:
    """_summary_ 
    This function tests the runlength_decoder.py

    Args:
        data (list): RLE encoded data to be decoded
        expected (list): decoded data to test against
    """
    actual_data = rl_decoder.decode(data)
    print(f"\nOrginal list: \n{data} \nExpected list: \n{expected} \nActual list: \n{actual_data}")



def main():
    """_summary_
    This is the main function that calls the test_rl_decoder function
    """
    # normal test with encoding done right
    test_rl_decoder(['P', 2, 'Q', 3, 'J', 1],['P', 'P', 'Q', 'Q', 'Q', 'J'])
    # When integer is zero 
    test_rl_decoder(['A', 0], [])
    # When list has no integers
    test_rl_decoder(['A','B','C'],['A','B','C'])
    # complex list with multiple integers
    test_rl_decoder(['P', 2, 'A', 0, 'b', 3],['P', 'P', 'b', 'b', 'b'])


if __name__ == "__main__":
    main()
    