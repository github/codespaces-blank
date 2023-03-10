"""
CS - 5001
Pranchal Shah
HW 05
This program is a text editor that can append, insert, 
and substitute text.
"""

def custom_join(t_list: list) -> str:
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
    i = 0
    while i < len(t_list):
        if not joint_text:
            joint_text = joint_text + t_list[i]
        else:
            # if t_list[i-1] == " ":
            #     joint_text = joint_text + t_list[i]
            #     i += 1
            if t_list[i] != ".":
                joint_text = joint_text + " " + t_list[i]
            else:
                joint_text = joint_text + t_list[i]
        i += 1
    return joint_text

def custom_split(t_original: str, include_annotations: bool) -> list:
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
    # include THIS IN THE DOCSTRIGN
    if include_annotations:
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

        # Check if there is any word remaining after the last delimiter
        if j < len(t_original):
            split_word = t_original[j:]
            split_list.append(split_word)

        return split_list

    else:
        return t_original.split()

def append(current_text: str, new_text: str) -> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_append (str): _description_

    Returns:
        str: _description_
    """
    # 1. if empty, no need to add space
    if not current_text:
        return new_text
    elif new_text != "":
        # 2. if new_text has space
        if new_text[0] == " ":
            return current_text + new_text
        # 3. if current_text has space
        elif current_text[-1] == " ":
            return current_text + new_text
        # 4. if both have no space
        else:
            return current_text + " " + new_text
    # 5. if new_text is empty
    elif new_text == "":
        return current_text

def add(current_text: str, new_text: str, start: int) -> str:
    """_summary_

    Args:
        original_text (str): _description_
        new_text (str): _description_
        position (int): _description_

    Returns:
        str: _description_
    """
    t_split = custom_split(current_text, False)
    if start >= len(t_split):
        return current_text + " " + new_text
    else:
        split_1 = custom_join(t_split[:start])
        split_2 = custom_join(t_split[start:])
        if start < 0:
            return new_text + " " + current_text
        elif start == 0:
            return new_text + " " + current_text
        else:
            return split_1 + " " + new_text + " " + split_2

def substitute(current_text: str, word: str, new_word: str) -> str:
    """_summary_

    Args:
        t_original (str): _description_
        t_sub (str): _description_
        t_new (str): _description_

    Returns:
        str: _description_
    """
    i = 0
    t_split = custom_split(current_text, True)
    # learn't that for loop iterates
    # over a copy of the list
    # hence, we use while loop
    while i < len(t_split):
        if t_split[i] == word:
            if new_word == "  ":
                t_split[i] = " "
            else:
                t_split[i] = new_word
        i += 1

    return custom_join(t_split)

def scramble(current_text: str) -> str:
    """_summary_

    Args:
        t_original (str): _description_

    Returns:
        str: _description_
    """
    result  = ''
    for char in current_text:
        ascii_number = ord(char)
        if 64 < ascii_number < 91 or 96 < ascii_number < 123:
            if (ascii_number + 2) > 122 or 90 < (ascii_number + 2) < 97 :
                new_char = chr(ascii_number - 24)
            else:
                new_char = chr(ascii_number + 2)
            result = result + new_char
        else:
            result = result + char
    return result

def unscramble(current_text: str)-> str:
    """_summary_

    Args:
        t_original (str): _description_

    Returns:
        str: _description_
    """
    result  = ''
    for char in current_text:
        ascii_number = ord(char)
        if 64 < ascii_number < 91 or 96 < ascii_number < 123:
            if 90 < (ascii_number - 2) < 97 or (ascii_number - 2) < 65:
                new_char = chr(ascii_number + 24)
            else:
                new_char = chr(ascii_number - 2)
            result = result + new_char
        else:
            result = result + char
    return result
   