"""
CS 5001
Homework 04
Pranchal Shah

"""

import hw4data as hw4

def decode(data):
    """
    # initiate a counter
    d, i = 0

    # while d is less than all the data lists,
    # wanted to use a function that access the number of data lists variable
    # that updates with additions of more data lists
    while d < 5:
        # a new list called as decoded_data[i]
        decoded_data[d] = []
        while i < len(hw4.DATA[d]):
            j = 0
            while j < hw4.DATA0[i + 1]:
                decoded_data[d].append(hw4.DATA[d][i])
                j = j + 1
            i = i + 2
        print(decoded_data[0])
    """
    # initiate empty list
    decoded_data = []

    # while i is less than list length,
    i = 0
    while i < len(data):
        # append copies of the item in list[i]
        # list [i+1] times
        j = 0
        while j < data[i+1]:
            decoded_data.append(data[i])
            j = j + 1
        # jump to next even number item in list
        i = i + 2
    print (decoded_data)
    return decoded_data


def main():
    """_summary_ This is the main function that calls the decode function
    """

    # can i use a while loop here to iterate all data sets?
    decoded_data0 = decode(hw4.DATA0)
    decoded_data1 = decode(hw4.DATA1)
    decoded_data3 = decode(hw4.DATA3)
    decoded_data4 = decode(hw4.DATA4)
    decoded_data5 = decode(hw4.DATA5)

    all_decoded_data = decoded_data0 + decoded_data1 + decoded_data3 + decoded_data4 + decoded_data5
    single_string = "".join(all_decoded_data)

    print(single_string)

main()
