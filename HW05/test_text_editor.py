"""
CS - 5001
Pranchal Shah
HW 05
This is a test file that tests each function in text_editor.py
It creats five functions to test each function in text_editor.py
"""
import text_editor as t_editor

def test_append(case_number: int, current_text: str,
                     new_text: str, text_expected: str)-> str:
    """
    This function tests the append feature of the text editor program.
    It takes in a current text, a new text to be appended, and the expected
    resulting text. The function then calls the append function of the text
    editor program and prints the actual result with the expected result.

    Args:
        case_number (int): A unique identifier for the test case
        current_text (str): The original text that the new text will be appended to
        new_text (str): The text to be appended to the current text
        text_expected (str): The expected result after appending the new text

    Returns:
        None. The function prints the actual and expected results for the test case.
    """
    t_actual = t_editor.append(current_text, new_text)
    print (f"\nAppend text, Test Case {case_number}:\
           \nOut:'{t_actual}'\nExp:'{text_expected}'")

def test_add(case_number: int, current_text: str,
                     new_text: str, position: int, text_expected: str)-> str:
    """
    This function tests the insert feature of the text editor program.
    It takes in the current_text, the text to be inserted,
    the position to insert the text, and the expected resulting text.
    The function then calls the add function of the text editor program
    and prints the actual result with the expected result.

    Args:
        case_number (int): A unique identifier for the test case
        current_text (str): The original text before inserting the new text
        new_text (str): The text to be inserted into the original text
        position (int): The position in the original text to insert the new text
        text_expected (str): The expected result after inserting the new text

    Returns:
        None. The function prints the actual and expected results for the test case.
    """
    t_actual = t_editor.add(current_text, new_text, position)
    print (f"\nInsert Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{text_expected}")

def test_substitute(case_number: int, current_text: str,
                         word: str, new_word: str, text_expected: str)-> str:
    """
    This function tests the substitute function of the text editor program.
    It takes in the current text, the word to be replaced, the new word to replace it,
    and the expected resulting text. The function then calls the substitute function
    of the text editor program and compares the actual result with the expected result.

    Args:
        case_number (int): A unique identifier for the test case
        current_text (str): The current text before substituting the word
        word (str): The word to be replaced in the current text
        new_word (str): The new word to replace the old word in the current text
        text_expected (str): The expected result after substituting the word

    Returns:
        None. The function prints the actual and expected results for the test case.  
    """
    t_actual = t_editor.substitute(current_text, word, new_word)
    print (f"\nSubstitute Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{text_expected}")

def test_scramble(case_number: int, current_text: str, text_expected: str)-> str:
    """
    This function tests the scramble function of the text editor program.
    It takes in the current text and the expected resulting text after scrambling.
    The function then calls the scramble function of the text editor program
    and compares the actual result with the expected result.

    Args:
        case_number (int): A unique identifier for the test case
        current_text (str): The current text before scrambling
        text_expected (str): The expected result after scrambling the text

    Returns:
        None. The function prints the actual and expected results for the test case.
    """
    t_actual = t_editor.scramble(current_text)
    print (f"\nUn-Scramble Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{text_expected}")

def test_unscramble(case_number: int, current_text: str, text_expected: str)-> str:
    """
    This function tests the `unscramble` method of the text editor.

    Args:
        case_number (int): The index of the test case.
        current_text (str): The original text before scrambling.
        text_expected (str): The expected unscrambled text.

    Returns:
        str: A string representing the result of the test case.
    """
    t_actual = t_editor.unscramble(current_text)
    print (f"\nScramble Text, Test Case {case_number}:\
           \nOut:{t_actual}\nExp:{text_expected}")

def main():
    """
    This function is used to test the functionality of the string editing methods
    'append', 'insert', 'substitute', 'scramble', and 'unscramble'. The function
    calls each of these methods and passes in various test cases to ensure that
    the methods are working as intended. Each test case is numbered for easy reference.

    Args:
        None

    Returns:
        None
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
