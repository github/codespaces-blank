"""
CS 5001
Pranchal Shah
HW 06

This file contains functions that read the contents of a file 
and produce a sequence of symbols that can be used to draw.
"""

def get_grammar(grammar_string: str) -> dict:
    """
    This function takes contents of grammar file and 
    returns a dictionary that contains entries for each key
    
    Preconditions:
        grammar_string is a string containing contents of grammar file

    Raises:
        ValueError if the file is not formatted correctly
        ValueError if the file does not contain all the required commands
        ValueError if the file contains invalid commands

    Args:
        grammar_string (str): single string containing contents of file

    Returns:
        grammar (dict): key value pairs of grammar file
    """
    grammar = {}
    # split into lines
    sep_lines = grammar_string.splitlines()

    # Flags to check if required commands are present
    symbols_present = False
    start_present = False
    iterations_present = False

    try:
        # for each part, break into keys and values
        for each_line in sep_lines:
            words = each_line.split()
            key = "".join(words[:-1])
            if not each_line:
                continue
            # update grammar dictionary only if valid key
            if key == "symbols":
                value = words[-1]
                grammar.update({key: value})
                symbols_present = True
            elif key == "start":
                value = words[-1]
                grammar.update({key: value})
                start_present = True
            elif key == "angle":
                value = words[-1]
                grammar.update({key: value})
            elif key == "iterations":
                value = words[-1]
                grammar.update({key: value})
                iterations_present = True
            elif key.startswith("rule") or key.startswith("draw"):
                value = words[-1]
                grammar.update({key: value})
            # if not, raise ValueError
            else:
                raise ValueError\
                     ("Invalid formatting in grammar file in line: " \
                       + each_line)

        if not symbols_present or not start_present or \
           not iterations_present:
            raise ValueError\
                 ("The grammar file does not contain all the required commands")

    except ValueError:
        # Handle the exception by printing the error message
        return "The grammar file is not formatted correctly"

    return grammar

def produce(grammar: dict) -> str:
    """
    This function uses the dictionary returned by get_grammar
    starting with the start sequence and applying the rules to expand
    
    Preconditions:
        grammar is a dictionary containing all the required commands
    
    Raises:
        ValueError if the grammar does not contain a starting sequence
        ValueError if the grammar does not contain iterations
        ValueError if the grammar does not contain start
    Args:
        grammar (dict): Dictionary of grammar rules

    Returns:
        sequence(str): sequence of symbols produced by applying rules
    """
    original_string = ""
    try:
        start_flag = False
        iterations_flag = False
        for each_key in grammar:
            if each_key == "start":
                start_string = grammar[each_key]
                start_flag = True
            elif each_key == "iterations":
                iterations = grammar[each_key]
                iterations_flag = True
            elif each_key == "symbols":
                original_string = grammar["symbols"]
        if not start_flag:
            raise ValueError
        if not iterations_flag:
            raise ValueError
        # if no starting sequence, raise ValueError
    except ValueError:
        return "Does not contain either a starting sequence or iterations"

    expanded_string = ""
    # start with "START symbol"
    for each_symbol in start_string:
        flag = False
        # can convert this into a function
        for key in grammar:
            if key.startswith("rule"):
                part = key.split("rule")
                variable = part[-1]
                if variable == each_symbol:
                    expanded_string = expanded_string + grammar[key]
                    flag = True
                    break
        if not flag:
            expanded_string = expanded_string + each_symbol

    # iterate over all "SYMBOLs" in original string
    for each_symbol in original_string:
        # flag will turn true if symbol is found in grammar
        flag = False
        # finds the "SYMBOL RULES" for each symbol if present
        for key in grammar:
            if key.startswith("rule"):
                part = key.split("rule")
                variable = part[-1]
                if variable == each_symbol:
                    expanded_string = expanded_string + grammar[key]
                    flag = True
                    break
        # if flag is false, SYMBOL RULE is not found in grammar
        # hence, append original symbol to expanded string
        if not flag:
            expanded_string = expanded_string + each_symbol

    # repeat the expanded string = iterations times
    sequence = ""
    for _ in range(int(iterations)):
        sequence = sequence + expanded_string

    return sequence
