"""
CS 5001
Pranchal Shah
HW 06

This file Asks the user to input the name of a file in the above format.
"""

import grammar
import draw_grammar

def main():
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
        draws = draw_grammar.draw(dictionary, sequence)
        print(draws)
    except ValueError as e:
        print(e)
    

if __name__ == "__main__":
    main()
