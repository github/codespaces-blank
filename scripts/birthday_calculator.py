#!/usr/bin/env python3

print('Welcome to the age calculator.')
answer = input('Would you like to know how old you will be in a particular year? (y/n)')

while not (answer == 'y' or answer == 'n'):
    print("The value of answer is", answer)
    print("I'm sorry, I didn't understand. Please try again.")
    answer = input('Would you like to know how old you will be in a particular year? (y/n)')

if answer == 'n':
    print("I'm sorry you're not interested. Goodbye!")
else:
    year = input('What year were you born?')
    month = input('In what month were you born?:For example: jan/january').lower()
    day = input('On what day?')
    future_year = input('What year did you want to know about?')
    future_month = input('what will be your future  month like?For example: jan/january').lower()
    future_day = input('what will be your future day like?')
    
    if month.isdigit()==True:
        print('print the month in letters, not in numbers')
    else:
        if month=="jan" or month=="january":
            month=1
        if month=="feb" or month=="february":
            month=2   
        if month=="mar" or month=="march":
            month=3
        if month=="apr" or month=="april":
            month=4
        if month=="may" or month=="may":
            month=5
        if month=="jun" or month=="june":
            month=6   
        if month=="jul" or month=="july":
            month=7
        if month=="aug" or month=="august":
            month=8   
        if month=="sep" or month=="september":
            month=9
        if month=="oct" or month=="october":
            month=10
        if month=="nov" or month=="november":
            month=11
        if month=="dec" or month=="december":
            month=12          

    if future_month.isdigit()==True:
        print('print the month in letters, not in numbers')
    else:
        if future_month=="jan" or month=="january":
            future_month=1
        if future_month=="feb" or month=="february":
            future_month=2   
        if future_month=="mar" or month=="march":
            future_month=3
        if future_month=="apr" or month=="april":
            future_month=4
        if future_month=="may" or month=="may":
            future_month=5
        if future_month=="jun" or month=="june":
            future_month=6   
        if future_month=="jul" or month=="july":
            future_month=7
        if future_month=="aug" or month=="august":
            future_month=8   
        if future_month=="sep" or month=="september":
            future_month=9
        if future_month=="oct" or month=="october":
            future_month=10
        if future_month=="nov" or month=="november":
            future_month=11
        if future_month=="dec" or month=="december":
            future_month=12   
    age_in_year = int(future_year) - int(year)    
    if future_month<=month:
        age_in_year=age_in_year-1
        if future_month==month:
            if future_day>=day:
                age_in_year+=1

        

    print('The value of born month is', month, 'and the value of futureMonth is', future_month, '.')
    print('In the year ', future_year, 'you will be ', age_in_year, ' years old.')
    print('Goodbye!')