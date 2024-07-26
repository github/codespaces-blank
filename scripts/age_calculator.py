#!/usr/bin/env python3
print('Welcome to the age calculator.')
answer = input('Would you like to know how old you will be in a particular year? (y/n)')
if answer == "y":
    year = input('What year were you born?')
    future = input('What year did you want to know about?')

    age = int(future) - int(year)

    print('In the year ', future, 'you will be ', age, ' years old.')
    print('Goodbye!')  
elif answer=="n":
    print("Okay! no problem!")
# elif answer!="y" or answer!="n":
else:
    print("choose a valid option")        
