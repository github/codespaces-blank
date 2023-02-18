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
        list: _description_
    """
    suits = ["s", "h", "d", "c"]
    values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    deck = []
    for value in values:
        for suit in suits:
            card = value + suit
            deck.append(card)
    return deck


def shuffle(cards: list) -> list:
    """_summary_

    Args:
        cards (list): _description_

    Returns:
        list: _description_
    """
    
    shuffled_cards = []
    random_list = []
    
    #initiate a counter
    i,j = 0,0
    
    # firstly, we will create a list of random numbers 
    # from 0 to the length of the cards list = 52
    while i < len(cards):
        num = random.randrange(len(cards))
        # to avoid duplicates, we will append the number to the list only if 
        # it is not already in the list
        if num not in random_list:
            random_list.append(num)
        else:
            continue
        i = i + 1

    # now we will create a new list of cards in the shuffled order
    while j < len(cards):
        shuffled_cards.append(cards[random_list[j]])
        j = j + 1
    return shuffled_cards

def main():
    """_summary_ This is the main function that calls the create_deck function
    """
    deck = create_deck()
    print(deck)
    shuffled_deck = shuffle(deck)
    print(f" Shuffled Cards = {shuffled_deck}")

main()
