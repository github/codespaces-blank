"""
CS 5001
Homework 04
Pranchal Shah

This program uses lists to create, shuffle, and 
deal cards to a number up to 4 “hands”.
"""

import random

def create_deck() -> list:
    """_summary_ This function creates a deck of cards

    Returns:
        list: A deck of cards in a list
    """
    suits = ["s", "h", "d", "c"]
    values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
    deck = []

    # for each value in list "values"
    # concatenate it with each suit in list "suits"
    for value in values:
        for suit in suits:
            card = value + suit
            deck.append(card)

    return deck


def shuffle(cards: list) -> list:
    """_summary_ This function shuffles a deck of cards, 
    and returns a new list of cards in the shuffled order

    Args:
        cards (list): list of cards

    Returns:
        shuffled cards (list): list of cards in shuffled order
    """

    shuffled_cards = []
    random_list = []

    # initiate a counter
    i, j = 0, 0

    # firstly, create a list of random numbers
    # from 0 to the length of the cards list = 52
    while i < len(cards):

        # generate a random number from 0 to the length of the cards list
        num = random.randrange(len(cards))

        # to avoid duplicates, append the number to the list only if
        # it is not already in the list
        if num not in random_list:
            random_list.append(num)
        else:
            continue
        i = i + 1

    # now create a new list of cards in the shuffled order
    while j < len(cards):
        shuffled_cards.append(cards[random_list[j]])
        j = j + 1
    return shuffled_cards


def deal(number_of_hands: int, number_of_cards: int, cards: list) -> list:
    """_summary_ 
    this function deals a number of cards to a number of hands.

    Args:
        number_of_hands (int): number of hands to deal to must be 1..4
        number_of_cards (int): number of cards to deal in each hand 
                               must be 0..13
        cards (list): list of cards, in any order to deal from

    Returns:
        list: list of lists, each containing the cards dealt to a hand
    """
    i, j, k = 0, 0, 0
    dealt_cards = []

    # create a list to store remainig cards
    # which is they copy of the original list
    remaining_cards = cards.copy()

    # check if the number of hands is less than or equal to 4
    if number_of_hands <= 4:

        # check if the number of cards is less than or equal to 13
        if number_of_cards <= 13:

            # loop runs as many times as the number of hands
            while i < number_of_hands:
                new_list = []

                # reset the value of j everytime i loop runs
                j = 0

                # everytime i loop runs, we increase the value of k by 1
                # first card to be added into a hand would
                # always be the card at index i
                k = i

                while j < number_of_cards:
                    # append the card at index k to the new list
                    # first loop would be   0,4,8,12
                    # second loop would be  1,5,9,13
                    # third loop would be   2,6,10,14
                    # fourth loop would be  3,7,11,15
                    new_list.append(cards[k])

                    # remove the card at index k from the remaining cards list
                    # without modifying the original list
                    if i == (number_of_hands - 1):
                        del remaining_cards[0]
                    else:
                        if j == 0:
                            base_number = 0
                            del remaining_cards[base_number]
                        elif j == 1:
                            base_number = number_of_hands - i - 1
                            del remaining_cards[base_number]
                        elif j > 1:
                            index = j * base_number
                            del remaining_cards[index]

                    # jump to the card at index k + number_of_hands
                    k = k + number_of_hands
                    j = j + 1

                # append one hand to the list before moving to the next hand
                dealt_cards.append(new_list)
                i = i + 1
            return (dealt_cards, remaining_cards)
        else:
            print("Invalid input arguments")
            return None
    else:
        print("Invalid input arguments")
        return None


def main():
    """_summary_ 
    This is the main function that calls the create_deck function
    """
    deck = create_deck()
    print(f"Original Deck: \n{deck}")

    shuffled_deck = shuffle(deck)
    # print(f" Shuffled Deck: \n{shuffled_deck}")

    dealt_hands, remaining_cards = deal(1, 2, deck)
    print(f"Dealt Hands: \n{dealt_hands}")
    print(f"Remaining cards: \n{remaining_cards}")


# Run main only if this file is directly executed
# NOT when imported as a module
if __name__ == "__main__":
    main()
