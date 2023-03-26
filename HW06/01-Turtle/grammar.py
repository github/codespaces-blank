"""
CS 5001
Pranchal Shah
HW 06
"""
# 1. write pre condition for all doc-strings
# ask TA to help you review parts of the assignment!
# review where you lost marks in the previous assignment
# 3. use raise and except for error handling in functions

#import turtle as t

def get_grammar(grammar_string: str)->dict:
    """
    This function takes contents of grammar file and 
    returns a dictionary that contains entries for each key
    
    Raises:
        ValueError if the file is not formatted correctly

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
                raise ValueError("Invalid formatting in grammar file in line: " + each_line)

        if not symbols_present or not start_present or not iterations_present:
            raise ValueError("The grammar file does not contain all the required commands")
    
    except ValueError:
        # Handle the exception by printing the error message and returning an empty dictionary
        return ("The grammar file is not formatted correctly")

    return grammar

def produce(grammar: dict)->str:
    """
    This function uses the dictionary returned by get_grammar
    starting with the start sequence and applying the rules to expand

    Args:
        grammar (dict): _description_

    Returns:
        str: _description_
    """
    # if no starting sequence, raise ValueError
    if not grammar["start"]:
        raise ValueError("The dictionary does not contain a starting sequence")
    else:
        start_string = grammar["start"]
    original_string = grammar["symbols"]
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
    for key in grammar:
        if key.startswith("iteration"):
            repeat = int(grammar[key])
            for i in range(repeat):
                sequence = sequence + expanded_string
    print (sequence)
    return sequence

