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

def deal(number_of_hands : int, number_of_cards : int, cards : list) -> list:
    i,j,k = 0,0,0
    dealt_cards = []
    
    # create a list to store remainig cards
    remaining_cards = cards.copy()
    
    # check if the number of hands is less than or equal to 4
    if number_of_hands <= 4:
        
        # check if the number of cards is less than or equal to 13
        if number_of_cards <= 13:
            
            while i < number_of_hands:
                new_list = []
                
                # everytime i loop runs, we increase the value of j by 1
                # first loop would be   1,5,9
                # second loop would be  2,6,10
                # third loop would be   3,7,11
                j = 0
                
                # first card to be added into a hand would
                # always be the card at index i
                k = i
                
                while j < number_of_cards:
                    # append the card at index k to the new list
                    new_list.append(cards[k])
                    
                    # remove the card at index k from the remaining cards list
                    # without modifying the original list
                    if i == (number_of_hands - 1):
                        del remaining_cards[0]
                    else:
                        if j == 0 :
                            a = 0
                            del remaining_cards[a]
                        elif j == 1:
                            a = number_of_hands - i - 1
                            del remaining_cards[a]
                        elif j > 1:
                            index = j*a
                            del remaining_cards[index]
                    # jump to the card at index k + number_of_hands
                    k = k + number_of_hands
                    j = j + 1
                
                # append one hand to the list before moving to the next hand
                dealt_cards.append(new_list)
                i = i + 1
            return (dealt_cards, remaining_cards)
        else:
            print("Please enter a number of cards less than or equal to 13")
    else:
        print("Please enter a number of hands less than or equal to 4")
        

def main():
    """_summary_ This is the main function that calls the create_deck function
    """
    deck = create_deck()
    print(f"Original Deck: \n{deck}")
    
    shuffled_deck = shuffle(deck)
    print(f" Shuffled Deck: \n{shuffled_deck}")
    
    dealt_hands, remaining_cards = deal(4,12,shuffled_deck)
    print(f"Dealt Hands: \n{dealt_hands}")
    print(f"Remaining cards: \n{remaining_cards}")
main()
