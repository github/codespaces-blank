import random

def create_deck():
    suits = ['h', 'd', 'c', 's']
    ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
    cards = []
    for suit in suits:
        for rank in ranks:
            card = rank + suit
            cards.append(card)
    return cards

def shuffle(cards):
    shuffled_cards = []

    while len(shuffled_cards) != 52:
        index = random.randint(0, len(cards) - 1)
        if cards[index] not in shuffled_cards:
            shuffled_cards.append(cards[index])
    return shuffled_cards

def deal(number_of_hands, number_of_cards, cards):
    hands = [[] for i in range(number_of_hands)]
    for i in range(number_of_cards):
        for j in range(number_of_hands):
            card = cards.pop()
            hands[j].append(card)
    return hands


def main():
    cards = create_deck()
    print ("Original deck is\n",cards)
    shuffle_cards = shuffle(cards)
    print ("The shuffled deck is\n",shuffle_cards)
    A = int(input("Enter number of hands:"))
    B = int(input("Enter number of cards:"))
    number_of_hands = A
    number_of_cards = B
    dealt_hands = deal(number_of_hands, number_of_cards, shuffle_cards)
    print(dealt_hands)
    print("Cards left in deck\n",cards)

if __name__ == "__main__":
    main()
