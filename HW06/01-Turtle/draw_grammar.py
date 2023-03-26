"""
CS 5001
Pranchal Shah
HW 06

This file contains the draw function that takes in a grammar dictionary
and sequence and draws the sequence using turtle.
"""

import turtle as t

def draw(grammar: dict, sequence: str)-> exec:
    """
    If the sequence contains a symbol that does not have a drawing rule,
    then this function should simply ignore that symbol
    and proceed further.
    This function would not raise any exceptions.

    Args:
        grammar (dict): dictionary of grammar rules
        sequence (str): sequence of symbols produced by produce function

    Returns:
        exec: commands to draw the sequence
    """
    # -2 = would be to create a dictionary of commands
    # {A: 't.move(20)', B: 't.move(100)', -: 't.turn(-25)'....}
    commands = {}
    # iterate over all keys to look for
    for key in grammar:
        # look for draw
        if key.startswith("draw"):
            part = key.split("draw")
            variable = part[-1]
            command = f"t.forward({grammar[key]})"
            commands.update({variable:command})
        # look for angle
        elif key.startswith("angle"):
            negative_angle = f"t.right({grammar[key]})"
            positive_angle = f"t.left({grammar[key]})"
            commands.update({"-":negative_angle})
            commands.update({"+":positive_angle})

    # -1 = last step
    for symbol in sequence:
        command = commands[f"{symbol}"]
        exec(command)
