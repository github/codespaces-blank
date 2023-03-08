def split_text(t_original: str) -> list:
    """
    This function splits the text into a list of words, based on
    " ", ".", "\n", "\t" as delimiters. I had to create this becasue
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
            
            if t_original[i] == ".":
                split_list.append(".")
            j = i + 1
        i += 1
        
    if j < len(t_original):  
        split_list.append(t_original[j:])
        
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
    t_split = t_original.split(" ")
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
    t_split = t_original.split()
    # learn't that for loop iterates
    # over a copy of the list
    # hence, we use while loop
    while i < len(t_split):
        if t_split[i] == t_sub:
            t_split[i] = t_new
        i += 1

    return " ".join(t_split)



def main():
    a = split_text("Hellow NEU. Welcome to CS-5001.")
    print (a)
    

if __name__ == "__main__":
    main()