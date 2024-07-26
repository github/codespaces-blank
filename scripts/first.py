#!/usr/bin/env python3

print("welcome to the age calculator")
answer=input("would you like to continue using this calculator?")

born_year=input("mention your the year you born: ")


future_year=input("enter your future year: ")

age=0
age=int(future_year)-int(born_year)
print("your age will be: {}".format(age))
print('goodbye!')