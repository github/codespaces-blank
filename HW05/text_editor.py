"""
CS - 5001
Pranchal Shah
HW 05
This program is a text editor that can append, insert, 
and substitute text.
"""

def custom_join(t_list: list)-> str:
    """
    This function joins a list of words into a string. 
    DOES NOT ADD A SPACE when joining "."
    Which is exactly different from the join() function in python.

    Args:
        t_list (list): list of words split from the original text

    Returns:
        joint_text (str): text joined from the list of words, without space
                           before "."
    """
    joint_text = ""
    for word in t_list:
        if not joint_text:
            joint_text = joint_text + word
        else:
            if word != ".":
                joint_text = joint_text + " " + word
            else:
                joint_text = joint_text + word
    return joint_text

def custom_split(t_original: str) -> list:
    """ 
    This function splits the text into a list of words, based on
    [" ", ".", "\n", "\t"] as delimiters. I had to create this becasue
    the split() function in python does not split multiple delimiters
    together.
    
    Args:
        t_original (str): Original text to be split

    Returns:
        split_list (list): List has split words based on delimiters
    """
    i, j = 0, 0
    split_list = []

    # this loop runs = len of string
    while i < len(t_original):

        # if the character is a delimiter
        if t_original[i] in [" ", ".", "\n", "\t"]:
            # create a word from j to i
            split_word = t_original[j:i]

            # append only if it is not empty string
            if split_word != "":
                split_list.append(split_word)
            # append the delimiter if it is a period
            if t_original[i] == ".":
                split_list.append(".")

            # update j to i + 1 to start a new word and not include the delimiter
            j = i + 1
        i += 1

    return split_list

def append_text(t_original: str, t_append: str)-> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_append (str): _description_

    Returns:
        str: _description_
    """
    return t_original + " " + t_append

def insert_text(t_original: str, t_insert: str, position: int)-> str:
    """_summary_

    Args:
        original_text (str): _description_
        new_text (str): _description_
        position (int): _description_

    Returns:
        str: _description_
    """
    t_split = custom_split(t_original)
    split_1 = " ".join (t_split[:position])
    split_2 = " ".join (t_split[position:])
    if position < 0:
        return t_insert + " " + t_original
    return split_1 + " " + t_insert + " " + split_2

def substitute_text(t_original: str, t_sub: str, t_new: str)-> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_sub (str): _description_
        t_new (str): _description_

    Returns:
        str: _description_
    """
    i = 0
    t_split = custom_split(t_original)
    # learn't that for loop iterates
    # over a copy of the list
    # hence, we use while loop
    while i < len(t_split):
        if t_split[i] == t_sub:
            t_split[i] = t_new
        i += 1

    return custom_join(t_split)
