import text_editor as t_editor
    """_summary_
    """

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



def main():
    """_summary_
    """
    # Test Cases for append_text:
    test_append_text(0,"Welcome", "to CS-5001", "Welcome to CS-5001") # Ideal case
    test_append_text(1,"Hello World", "", "Hello World") # Empty append
    test_append_text(2,"", "to CS-5001", " to CS-5001") # Empty original


    # Test Cases for insert_text
    t_original = "I like apples"
    t_insert = "###"
    
    # Ideal case
    test_insert_text(0, t_original, t_insert, 1, "I ### like apple")
    # Insert at beginning
    test_insert_text(1, t_original, t_insert, 0, " ### I like apples")
    # Greater than 3
    test_insert_text(2, t_original, t_insert, 5, "I like apples ###")
    # Insert at end
    test_insert_text(3, t_original, t_insert, 3, "I like apples ###")
    # Negative position
    test_insert_text(4, t_original, t_insert, -1, "### I like apples")

if __name__ == "__main__":
    main()
