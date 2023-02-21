"""
CS 5001
Homework 04
Pranchal Shah

This program decodes lists from hw4data.py
into a longer list
"""

import hw4data as hw4

def decode(data) -> list:
    """_summary_ 
    This function decodes a list of integers
    
    Args:
        data (list): lists with RLE encoded data
    Returns:
        decoded_data (list): A list of decoded data
    """

    # initiate empty list
    decoded_data = []

    i = 0
    # this loop iterates through the encoded list
    while i < len(data):
        j = 0

        # if the next item in the list is not an integer
        if not isinstance(data[i + 1], int):
            print("The next item in the list is not an integer")
            return data

        # the loop j runs the number of times
        # specified by the 'next item' or 'i+1' item in the list
        while j < data[i + 1]:
            decoded_data.append(data[i])
            j = j + 1
        # jump to next even number item in list
        i = i + 2
    return decoded_data


def main():
    """_summary_ 
    This is the main function that calls the decode function
    """

    # decoded data from hw4data.py
    decoded_data0 = decode(hw4.DATA0)
    decoded_data1 = decode(hw4.DATA1)
    decoded_data2 = decode(hw4.DATA2)
    decoded_data3 = decode(hw4.DATA3)
    decoded_data4 = decode(hw4.DATA4)
    decoded_data5 = decode(hw4.DATA5)

    # combine all decoded data into a single list
    all_decoded_data = decoded_data0 + decoded_data1 + decoded_data2 \
        + decoded_data3 + decoded_data4 + decoded_data5

    # convert list to string
    single_string = "".join(all_decoded_data)

    print(single_string)


# Run main only if this file is directly executed
# NOT when imported as a module
if __name__ == "__main__":
    main()
