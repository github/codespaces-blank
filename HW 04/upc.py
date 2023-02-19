def is_valid_upc(list_of_integers : list)-> bool:

    # firsty, reverse the number:
    # use list slicing
    # no indexes means the entire string
    # -1 means right to left
    list_of_integers = list_of_integers[::-1]

    # step 1: add the even digits
    sum_of_even, i = 0,0
    while i < len(list_of_integers):
        sum_of_even = sum_of_even + list_of_integers[i]
        i = i + 2

    # step 2: multiply odd digits by 3 and add them
    i,sum_of_odd = 1,0
    while i < len(list_of_integers):
        sum_of_odd = sum_of_odd + (list_of_integers[i] * 3)
        i = i + 2

    sum_of_upc = sum_of_even + sum_of_odd
    #return sum_of_upc % 10 == 0
    return sum_of_upc

def main():
    abc = is_valid_upc([1,2,3,4,5,6,7,8,9])
    print(abc)


main()