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
    split_text = t_original.split(None, position)
    return split_text[0] + " " + t_insert + " " + split_text[1]
