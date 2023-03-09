"""
CS - 5001
Pranchal Shah
HW 05
This is a test file that tests each function in text_editor.py
"""
import text_editor as t_editor

def test_append_text(case_number: int, t_original: str,
                     t_append: str, t_expected: str)-> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_append (str): _description_
        expected (str): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.append_text(t_original, t_append)
    print (f"\nAppend text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")

def test_insert_text(case_number: int, t_original: str,
                     t_insert: str, position: int, t_expected: str)-> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_insert (str): _description_
        position (int): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.insert_text(t_original, t_insert, position)
    print (f"\nInsert Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")

def test_substitute_text(case_number: int, t_original: str, 
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
    t_actual = t_editor.substitute_text(t_original, t_sub, t_new)
    print (f"\nSubstitute Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")

def test_scramble_text(case_number: int, t_original: str, t_expected: str)-> str:
    """_summary_

    Args:
        case_number (int): _description_
        t_original (str): _description_
        t_expected (str): _description_

    Returns:
        str: _description_
    """
    t_actual = t_editor.scramble_text(t_original)
    print (f"\nScramble Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{t_expected}")
    
    
def main():
    """
    _summary_
    """
    print("------------------ Test Cases for append_text ------------------")
    # Ideal case
    test_append_text(0,"Welcome", "to CS-5001", "Welcome to CS-5001")
    # Empty append
    test_append_text(1,"Hello World", "", "Hello World")
    # Empty original
    test_append_text(2,"", "to CS-5001", " to CS-5001")


    print("\n\n------------------ Test Cases for insert_text ------------------")
    t_original = "I like apples"
    t_insert = "###"
    # Ideal case
    test_insert_text(0, t_original, t_insert, 1, "I ### like apple")
    # Insert at beginning
    test_insert_text(1, t_original, t_insert, 0, " ### I like apples")
    # Insert at end
    test_insert_text(2, t_original, t_insert, 3, "I like apples ###")
    # Greater than 3
    test_insert_text(3, t_original, t_insert, 5, "I like apples ###")
    # Negative position
    test_insert_text(4, t_original, t_insert, -1, "### I like apples")


    print("\n\n--------------- Test Cases for substitute_text ---------------")
    t_original = "I like apples."
    t_new = "oranges"
    # Ideal case
    test_substitute_text(0, t_original, "apples", t_new, "I like oranges.")
    # Sub not in original
    test_substitute_text(1, t_original, "bananas", t_new, "I like apples.")
    # Empty original
    test_substitute_text(2, "", "apples", t_new, "")
    # Empty new
    test_substitute_text(3, t_original, "apples" , "", "I like .")
    # Case senstive
    test_substitute_text(4, t_original, "Apples", t_new, "I like apples.")


    print("\n\n--------------- Test Cases for scramble_text ---------------")
    # Ideal case
    test_scramble_text(0,"abcd", "cdef")
    # case sensitive
    test_scramble_text(1,"aBcD", "cDeF")
    # Multiple character types
    test_scramble_text(2,"[a1*b2*c3],[p$*q&*r!]", "[c1*d2*e3],[r$*s&*t!]")
    # Wrapping around
    test_scramble_text(3,"CS:5001: Python", "EU:5001: Ravjqp")
    # Empty string
    test_scramble_text(4," ", " ")
    
if __name__ == "__main__":
    main()
