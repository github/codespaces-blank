"""
CS 5001
Pranchal Shah
HW 06

This file Asks the user to input the name of a file in the above format.
And then calls functions from grammar.py and draw_grammar.py 
to print the results.
"""

import grammar
import draw_grammar

def main():
    """
    This function asks the user to input the name of a file in the above format.
    Then it runs the string through the functions and prints the results.
    """
    # try to open the file and read the contents
    # if file not found, print error message and return
    file_name = input(str("Please enter name of the file: "))
    try:
        with open(f"input_files/{file_name}", encoding='utf-8') as file:
            grammar_string = file.read()
    except FileNotFoundError:
        print("File not found")
        return

    # try running the string through the functions
    # if ValueError, print error message
    try:
        dictionary = grammar.get_grammar(grammar_string)
        print(dictionary)
        sequence = grammar.produce(dictionary)
        print(sequence)
        draw_grammar.draw(dictionary, sequence)
    except ValueError:
        print("File not formatted correctly")


if __name__ == "__main__":
    main()
