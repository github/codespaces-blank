"""
CS - 5001
Pranchal Shah
HW 05
This is a test file that tests each function in text_editor.py
"""
import text_editor as t_editor

def test_append(case_number: int, t_original: str,
                     t_append: str, t_expected: str)-> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_append (str): _description_
        expected (str): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.append(t_original, t_append)
    print (f"\nAppend text, Test Case {case_number}:\
           \nOut:'{t_actual}'\nExp:'{t_expected}'")

def test_add(case_number: int, t_original: str,
                     t_insert: str, position: int, t_expected: str)-> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_insert (str): _description_
        position (int): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.add(t_original, t_insert, position)
    print (f"\nInsert Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")

def test_substitute(case_number: int, t_original: str, 
                         t_sub: str, t_new: str, t_expected: str)-> str:
    """_summary_

    Args:
        case_number (int): _description_
        t_original (str): _description_
        t_sub (str): _description_
        t_new (str): _description_
        t_expected (str): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.substitute(t_original, t_sub, t_new)
    print (f"\nSubstitute Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")

def test_scramble(case_number: int, t_original: str, t_expected: str)-> str:
    """_summary_

    Args:
        case_number (int): _description_
        t_original (str): _description_
        t_expected (str): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.scramble(t_original)
    print (f"\nUn-Scramble Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")

def test_unscramble(case_number: int, t_original: str, t_expected: str)-> str:
    """_summary_

    Args:
        case_number (int): _description_
        t_original (str): _description_
        t_expected (str): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.unscramble(t_original)
    print (f"\nScramble Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")

def main():
    """
    _summary_
    """
    print("------------------ Test Cases for append ------------------")
    # Ideal case
    test_append(0,"Welcome", "to CS-5001", "Welcome to CS-5001")
    # Empty append
    test_append(1,"Hello World", "", "Hello World")
    # Empty original
    test_append(2,"", "to CS-5001", "to CS-5001")
    # Gradescope test case
    test_append(3,"this is a", " scooby doo!", "this is a scooby doo!")
    # Gradescope test case 2
    test_append(4,"this is a", "scooby doo!", "this is a scooby doo!")


    print("\n\n------------------ Test Cases for insert ------------------")
    t_original = "I like apples"
    t_insert = "###"
    # Ideal case
    test_add(0, t_original, t_insert, 1, "I ### like apple")
    # Insert at beginning
    test_add(1, t_original, t_insert, 0, "### I like apples")
    # Insert at end
    test_add(2, t_original, t_insert, 3, "I like apples ###")
    # Greater than 3
    test_add(3, t_original, t_insert, 5, "I like apples ###")
    # Negative position
    test_add(4, t_original, t_insert, -1, "### I like apples")
    # Gradescope test case
    test_add(5, "This is a long long sentence. It has some long words.", \
             "beware the ring", 11, "This is a long long sentence. beware the ring It has some long words.")


    print("\n\n--------------- Test Cases for substitute ---------------")
    t_original = "I like apples."
    t_new = "oranges"
    # Ideal case
    test_substitute(0, t_original, "apples", t_new, "I like oranges.")
    # Sub not in original
    test_substitute(1, t_original, "bananas", t_new, "I like apples.")
    # Empty original
    test_substitute(2, "", "apples", t_new, "")
    # Empty new
    test_substitute(3, t_original, "apples" , "", "I like .")
    # Case senstive
    test_substitute(4, t_original, "Apples", t_new, "I like apples.")
    # Gradescope test case
    test_substitute(5,"This is a long long sentence. It has some long words.", "This", "  ", \
                    " is a long long sentence. It has some long words.")


    print("\n\n--------------- Test Cases for scramble ---------------")
    # Ideal case
    test_scramble(0,"abcd", "cdef")
    # case sensitive
    test_scramble(1,"aBcD", "cDeF")
    # Multiple character types
    test_scramble(2,"[a1*b2*c3],[p$*q&*r!]", "[c1*d2*e3],[r$*s&*t!]")
    # Wrapping around
    test_scramble(3,"CS:5001: Python", "EU:5001: Ravjqp")
    # More Wrapping around
    test_scramble(4,"YyZz", "AaBb")
    # Empty string
    test_scramble(5," ", " ")

    print("\n\n--------------- Test Cases for unscramble ---------------")
    # Ideal case
    test_unscramble(0,"cdef", "abcd")
    # case sensitive
    test_unscramble(1,"cDeF", "aBcD")
    # Multiple character types
    test_unscramble(2,"[c1*d2*e3],[r$*s&*t!]", "[a1*b2*c3],[p$*q&*r!]")
    # Wrapping around
    test_unscramble(3,"EU:5001: Ravjqp", "CS:5001: Python")
    # More wrapping
    test_unscramble(4,"AaBb", "YyZz")
    # Empty string
    test_unscramble(5," ", " ")
        
if __name__ == "__main__":
    main()
