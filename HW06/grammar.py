"""
CS 5001
Pranchal Shah
HW 06
"""

def get_grammar(grammar_string: str)->dict:
    """
    This function takes contents of grammer file and 
    returns a dictionary that contains entries for each key
    
    ValueError if the file is not formatted correctly

    Args:
        grammar_string (str): _description_

    Returns:
        grammar (dict): _description_
    """
    grammar = {}
    # split into lines
    parts = grammar_string.splitlines()

    # for each part, break into keys and values
    for part in parts:
        line = part.split()
        key = "".join(line[:-1])
        # update grammar dictionary only if valid key
        if key in ["symbols", "start", "angle", "draw", "iterations", "rule"] \
        or key.startswith("rule") or key.startswith("draw"):
            value = line[-1]
            grammar.update({key: value})
        else:
            raise ValueError("Invalid key in grammar file")
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
    original_string = grammar["symbols"]
    expanded_string = ""
    # iterate over all symbols in original string
    for each_symbol in original_string:
        # flag will turn true if symbol is found in grammar
        flag = False
        for key in grammar:
            if key.startswith("rule"):
                part = key.split("rule")
                variable = part[-1]
                if variable == each_symbol:
                    expanded_string = expanded_string + grammar[key]
                    flag = True
                    break
        # if flag is false, symbol is not found in grammar
        # hence, append original symbol to expanded string
        if not flag:
            expanded_string = expanded_string + each_symbol
    repeated_string = ""
    for key in grammar:
        if key.startswith("iteration"):
            repeat = int(grammar[key])
            for i in range(repeat):
                repeated_string = repeated_string + expanded_string
    print(repeated_string)
    """ Raise errors if iterations not found
    or if start not found or symbols not found """

def draw(grammar: dict, sequence: str):
    """_summary_

    Args:
        grammar (dict): _description_
        sequence (str): _description_

    Returns:
        turtle: _description_
    """
    



def main():
    file_name = "example.txt"
    with open(f"input_files/{file_name}", encoding='utf-8') as file:
        grammar_string = file.read()
    line = get_grammar(grammar_string)
    for key in line:
        print(key, line[key])

    produce(line)

if __name__ == "__main__":
    main()
