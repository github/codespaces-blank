def can_rook_move(from_col, from_row, to_col, to_row):
    """
    This function checks whether a rook can move from one position
    to another position,
    based on the following parameters:

    :param from_col: (string) the column of the rook's starting position'
    :param from_row: (int) the row of the rook's starting position'
    :param to_col: (string) the column of the rook's destination position'
    :param to_row: (int) the row of the rook's destination position'

    :return: (boolean) whether the rook can move - True or False
    """

    # Firstly, let's convert all the strings to lower case
    # so we can accomodate all inputs
    from_col = from_col.lower()
    to_col = to_col.lower()

    # check
    if from_col == to_col or from_row == to_row:
        return True
    else:
        return False


def can_bishop_move(from_col, from_row, to_col, to_row):
    """
    This function checks whether a bishop can move from
    one position to another position,
    based on the following parameters:

    :param from_col: (string) the column of the bishop's starting position'
    :param from_row: (int) the row of the bishop's starting position'
    :param to_col: (string) the column of the bishop's destination position'
    :param to_row: (int) the row of the bishop's destination position'

    :return: (boolean) whether the bishop can move - True or False
    """

    # Firstly, let's convert all the strings to lower case
    # so we can accommodate all inputs
    from_col = from_col.lower()
    to_col = to_col.lower()

    # convert the strings to ASCII numbers
    # later use it to get the difference b/w them
    a_from_col = ord(from_col)
    a_to_col = ord(to_col)
    difference = abs(a_from_col - a_to_col)

    # check difference is similar
    if abs(from_row - to_row) == difference:
        return True
    else:
        return False


def can_queen_move(from_col, from_row, to_col, to_row):
    """
    This function checks whether a queen can move
    from one position to another position,
    based on the following parameters:

    :param from_col: (string) the column of the queen's starting position'
    :param from_row: (int) the row of the queen's starting position'
    :param to_col: (string) the column of the queen's destination position'
    :param to_row: (int) the row of the queen's destination position'

    :return: (boolean) whether the queen can move - True or False
    """
    # Firstly, let's convert all the strings to lower case
    # so we can accommodate all inputs
    from_col = from_col.lower()
    to_col = to_col.lower()

    # convert the strings to ASCII numbers
    # later use it to get the difference b/w them
    a_from_col = ord(from_col)
    a_to_col = ord(to_col)
    difference = abs(a_from_col - a_to_col)

    # check it is moving the same row or col
    if from_col == to_col or from_row == to_row:
        return True

    # or if going across
    elif abs(from_row - to_row) == difference:
        return True
    else:
        return False
