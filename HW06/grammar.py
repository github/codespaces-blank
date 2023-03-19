"""
CS 5001
Pranchal Shah
HW 06
"""
import turtle

def get_grammar(grammar_string: str)->dict:
    """
    This function takes contents of grammer file and 
    returns a dictionary that contains entries for the following:
    symbols: sequence of symbols
    start: starting sequence
    angle: angle in degrees
    drawX: distance to move forward
    iterations: number of iterations to run
    
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
    """_summary_

    Args:
        grammar (dict): _description_

    Returns:
        str: _description_
    """
    
    
def draw(grammar: dict, sequence: str)->turtle:
    """_summary_

    Args:
        grammar (dict): _description_
        sequence (str): _description_

    Returns:
        turtle: _description_
    """
    
def main():
    file = open("input_files/levy.txt", "r")
    grammar_string = file.read()
    file.close()
    print(get_grammar(grammar_string))
    
    
if __name__ == "__main__":
    main()
