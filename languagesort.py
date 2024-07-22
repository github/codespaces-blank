def sort_distance(distances):
    distances.sort(reverse=True)# Sort the list
    # Reverse the order of the list
    return distances


print(sort_distance([2,4,0,15,8,9]))
# Should print [15, 9, 8, 4, 2, 0]