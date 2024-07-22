# .
# Question 5
# The add_prices function returns the total price of all of the groceries in the  dictionary. Fill in the blanks to complete this function.
def add_prices(groceries):
	# Initialize the variable that will be used for the calculation
	total = 0
	# Iterate through the dictionary items
	for a in groceries:
		# print(a)
		# Add each price to the total calculation
		# Hint: how do you access the values of
		# dictionary items?
		total += groceries[a]
	# Limit the return value to 2 decimal places
	return round(total, 2)  

groceries = {"bananas": 1.56, "apples": 2.50, "oranges": 0.99, "bread": 4.59, 
	"coffee": 6.99, "milk": 3.39, "eggs": 2.98, "cheese": 5.44}

print(add_prices(groceries)) # Should print 28.44
