import chessmoves
from chessmoves import can_rook_move as rook
from chessmoves import can_bishop_move as bishop
from chessmoves import can_queen_move as queen


def test_various_moves(piece, from_col, from_row, to_col, to_row, expected):
    """
    This function is a test function to chessmoves
    :param piece: (string) The piece to move
    :param from_col: (string) the column of the bishop's starting position'
    :param from_row: (int) the row of the bishop's starting position'
    :param to_col: (string) the column of the bishop's destination position'
    :param to_row: (int) the row of the bishop's destination position'
    :param expected: (boolean) True if the move is expected, False otherwise

    :return: (boolean) True if output is true, False otherwise
    """

    # check if rook is being tested
    if piece == "rook":
        output_boolean = chessmoves.rook(from_col, from_row,
                                         to_col, to_row)
        print(f"Can rook move from ({from_col}, {from_row}) to "
              f"({to_col}, {to_row})?")
        print(f"Expected = {expected} v/s Output = {output_boolean}\n")
        return output_boolean

    # check if bishop is being tested
    elif piece == "bishop":
        output_boolean = chessmoves.bishop(from_col, from_row,
                                           to_col, to_row)
        print(f"Can bishop move from ({from_col}, {from_row}) to "
              f"({to_col}, {to_row})?")
        print(f"Expected = {expected} v/s Output = {output_boolean}\n")
        return output_boolean

    # check if queen is being tested
    elif piece == "queen":
        output_boolean = chessmoves.queen(from_col, from_row,
                                          to_col, to_row)
        print(f"Can queen move from ({from_col}, {from_row}) "
              f"to ({to_col}, {to_row})?")
        print(f"Expected = {expected} v/s Output = {output_boolean}\n")
        return output_boolean

    # if the user tests any other piece
    else:
        print(f"Piece {piece} is not a valid")
        return False


def main():
    # testing all moves
    test_various_moves('rook', 'd', 4, 'd', 1, 'True')
    test_various_moves('rook', 'd', 4, 'F', 7, 'False')
    test_various_moves('bishop', 'D', 4, 'f', 2, 'True')
    test_various_moves('bishop', 'd', 4, 'f', 1, 'False')
    test_various_moves('queen', 'd', 4, 'f', 1, 'False')
    test_various_moves('queen', 'd', 4, 'f', 2, 'True')


if __name__ == "__main__":
    main()
