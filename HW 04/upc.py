""""
CS 5001
Homework 04
Pranchal Shah

This program uses 
"""

def is_valid_upc(list_of_integers: list) -> bool:
    """_summary_ 
    This function checks if a UPC is valid or not
    Based on the algorithm described here:
    https://northeastern.instructure.com/courses/136697/assignments/1676739

    Args:
        list_of_integers (list): list of integers or the UPC number

    Returns:
        bool: True if the UPC is valid, False otherwise
    """

    # the exceptions
    if len(list_of_integers) < 2:
        return False
    elif all(digit == 0 for digit in list_of_integers):
        return False

    # firsty, reverse the number:
    # use list slicing
    # no indexes means the entire string
    # -1 means right to left
    list_of_integers = list_of_integers[::-1]

    # step 1: add the even digits
    sum_of_even, i = 0, 0
    while i < len(list_of_integers):
        sum_of_even = sum_of_even + list_of_integers[i]
        i = i + 2

    # step 2: multiply odd digits by 3 and add them
    i, sum_of_odd = 1, 0
    while i < len(list_of_integers):
        sum_of_odd = sum_of_odd + (list_of_integers[i] * 3)
        i = i + 2

    # step 3: add the two sums
    sum_of_upc = sum_of_even + sum_of_odd

    # return true if the sum is divisible by 10
    return sum_of_upc % 10 == 0
