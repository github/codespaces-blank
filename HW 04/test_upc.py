import upc

def test_upc(upc : list, expected : bool):
    actual = upc.is_valid_upc(upc)
    if actual == expected:
        print("Test PASSED")
    else:
        print("Test FAILED")

def main():
    test_upc([0,7,3,8,5,4,0,0,8,0,8,9], True)
    test_upc([1,2,3,4,5,6,7,8,9] , False)

main()