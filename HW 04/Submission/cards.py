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

    # This loop, create a list of random numbers
    while i < len(cards):

        # generate a random number
        num = random.randrange(len(cards))

        # to avoid duplicates
        if num not in random_list:
            random_list.append(num)
        else:
            continue
        i = i + 1

    # This loop appends cards to the shuffled cards list
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
        dealt_hands (list of lists): each containing the cards dealt to a hand
        cards (list) : list of cards, remaining in the deck
    """     # check if the number of hands is less than or equal to 4
    if number_of_hands > 4 or number_of_cards > 13:
        print("Invalid input arguments")
        return None

    dealt_hands = []

    # create a list of lists
    for i in range(number_of_hands):
        dealt_hands.append([])

    # distribute the cards to the hands
    for j in range(number_of_cards):
        for i in range(number_of_hands):
            dealt_hands[i].append(cards[0])
            cards.pop(0)

    return dealt_hands


def main():
    """
    _summary_ 
    This is the main function that calls the create_deck function
    """
    deck = create_deck()
    print(f"Original Deck is: \n{deck}")

    shuffled_deck = shuffle(deck)
    print(f" The shuffled Deck is: \n{shuffled_deck}")

    dealt_hands = deal(4, 3, deck)
    print(f"Dealt Hands: \n{dealt_hands}")
    print(f"Cards left in deck: \n{deck}")


if __name__ == "__main__":
    main()
