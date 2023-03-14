"""
CS - 5001
Pranchal Shah
HW 05
This program is a text editor that can append, insert, 
substitute text, scramble and unscramble text.
It also includes two helper functions custom_join() and custom_split()
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
    # this loop runs = len of list
    while i < len(t_list):
        # for the first iteration - no need to add space
        if not joint_text:
            joint_text = joint_text + t_list[i]
        # after the first iteration
        else:
            # if the word is NOT A period - add space
            if t_list[i] != ".":
                joint_text = joint_text + " " + t_list[i]
            # if the word is a period - DO NOT add space
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
        include_annotations (bool): If True, include annotations in the split

    Returns:
        split_list (list): List has split words based on delimiters
    """
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

                # update j to i + 1 to start a new word
                j = i + 1
            i += 1

        # Check if there is any word remaining after the last delimiter
        if j < len(t_original):
            split_word = t_original[j:]
            split_list.append(split_word)

        return split_list

    # if we do not want to include annotations
    else:
        return t_original.split()

def append(current_text: str, new_text: str) -> str:
    """
    This function appends the new string to the current string.
    Adds a space between the two strings if both strings do not.
    
    Args:
        current_text (str): Original string
        new_text (str): Text to be appended to the original string

    Returns:
        current_text (str): String with new text appended
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
    """
    This function inserts the "new string" at the "specified position".
    if the new string is added at the beginning (0) - space only on the right
    if position < 0, appends to the front of the string & space only on right
    else adds space on both sides of new string.
    
    Args:
        current_text (str): Original text to which new text is to be added
        new_text (str): New peice of text to be added to the original text
        start (int): position at which new text is to be added

    Returns:
        str: _description_
    """
    # split the text into a list of words
    # keeping the annotations seperately
    t_split = custom_split(current_text, False)
    
    # if start is greater than length of list, add it to the end
    if start >= len(t_split):
        return current_text + " " + new_text
    else:
        split_1 = custom_join(t_split[:start])
        split_2 = custom_join(t_split[start:])
        # if start is negative, add it to the front, space only on right
        if start <= 0:
            return new_text + " " + current_text
        # if positon above 0, add space on both sides
        else:
            return split_1 + " " + new_text + " " + split_2

def substitute(current_text: str, word: str, new_word: str) -> str:
    """
    This function substitutes "word" with "new word" in "original text".
    It iterates over all the words in the text and 
    replaces the word with the new word.

    Args:
        current_text (str): Original text in which the word is to be replaced
        word (str): string to be replaced
        new_word (str): string to be replaced with

    Returns:
        (str): Version of original text with word replaced
    """
    i = 0
    t_split = custom_split(current_text, True)
    # learn't that for loop iterates
    # over a copy of the list
    # hence, we use while loop
    while i < len(t_split):
        # if the word is found
        if t_split[i] == word:
            t_split[i] = new_word
        i += 1

    return custom_join(t_split)

def scramble(current_text: str) -> str:
    """
    This function scrambles the text by shifting the letters by ascii + 2.
    If the letter is a-z, it shifts it by 2.
    If the letter is A-Z, it shifts it by 2.
    if the letter is outside a-z or A-Z, wraps around to the beginning.
    
    Args:
        current_text (str): Text which is to be scrambled

    Returns:
        result (str): Scrambled text
    """
    result = ''
    for char in current_text:
        # get the ascii number for the character
        ascii_number = ord(char)
        # check if the char ascii is inside the range of a-z or A-Z
        if 64 < ascii_number < 91 or 96 < ascii_number < 123:
            # if the new char (ascii + 2) is outside the range of a-z or A-Z
            # wrap around to the beginning
            if (ascii_number + 2) > 122 or 90 < (ascii_number + 2) < 97:
                new_char = chr(ascii_number - 24)
            # if inside the range, shift by 2
            else:
                new_char = chr(ascii_number + 2)
            result = result + new_char
        else:
            result = result + char
    return result

def unscramble(current_text: str) -> str:
    """
    This function unscrambles the text scrambled by function scramble.
    by shifting the letters by ascii - 2.
    if the letter is a-z or A-Z, it shifts back by 2.

    Args:
        current_text (str): text scrambled by function scramble, or 
                            text which is to be unscrambled

    Returns:
        result (str): Unscrambled text
    """
    result = ''
    for char in current_text:
        ascii_number = ord(char)
        # check if the char ascii is inside the range of a-z or A-Z
        if 64 < ascii_number < 91 or 96 < ascii_number < 123:
            # if new char is outside the range of a-z or A-Z
            # Wrap around to the end
            if 90 < (ascii_number - 2) < 97 or (ascii_number - 2) < 65:
                new_char = chr(ascii_number + 24)
            else:
                new_char = chr(ascii_number - 2)
            result = result + new_char
        else:
            result = result + char
    return result
   