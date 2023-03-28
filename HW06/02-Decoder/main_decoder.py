"""
    Ask the user to input the name of a code table file.
    Ask the user to input the name of a file that contains the encoded message.
    Extract the contents of the code table file as a single string.

    Build the dictionary from contents of the code table file.
    If this step does not succeed, it should print a helpful message and stop.

    Extract the encoded message from the file.
    Decode the encoded message extracted in step 5, using the code table built in step 4.
    If this step does
    not succeed, it should print a helpful message and stop.
    Print the decoded message directly on the screen.

    Use the provided code.txt and encoded-message.txt in this way, and
    save the resulting decoded message in decoded-message.txt.
"""

import decoder

def main():
    """
    This function asks the user to input the name of a file
    Then it runs the string through the functions and prints the results.
    """
    # try to open the file and read the contents
    # if file not found, print error message and return
    code_file = input(str("Please enter name of the code table file: "))
    try:
        with open(f"{code_file}", encoding='utf-8') as file:
            code_table_as_string = file.read()
    except FileNotFoundError:
        print("File not found")
        return

    # try running the string through the functions
    # if ValueError, print error message
    try:
        code_table = decoder.load_code_table(code_table_as_string)
    except ValueError:
        print("File not formatted correctly")
        return

    # try to open the file and read the contents
    # if file not found, print error message ang the encoded message file: "))
    encoded_file = input(str("Please enter name of the encoded message file: "))
    try:
        with open(f"{encoded_file}", encoding='utf-8') as file:
            encoded_message = file.read()
    except FileNotFoundError:
        print("File not found")
        return

    # try running the string through the functions
    # if ValueError, print error message
    try:
        decoded = decoder.decode(code_table, encoded_message)
        print(decoded)
    except ValueError:
        print("File not formatted correctly")
        return

if __name__ == "__main__":
    main()
