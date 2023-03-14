def binary_to_decimal(binary):
    #start with 0
    result = 0
    # go thorugh each digit - left to right
    for bit in binary:
        # result = result * 2 + bit
        result = 2 * result + int(bit)
    return result

def decimal_to_binary(decimal):
    # write it at hoem as an exercise
    
def base_to_decimal(number, base):
    # write it at hoem as an exercise
    
def decimal_to_base(number, base):
    # write it at home as exercise
    
    
"""
Persistence, keep the data from closed file
how do you do it?
"""

def main():
    file = open('input.txt', 'r') # read only
    contents = file.read()
    content_lines = file.readlines()
    print("Contents of the file: "+contents)
    
    first_name, last_name = content_lines[0].split() # split on whitespace
    
    phone_number = content_lines[1]
    
    line3 = content_lines[2].split()
    house_number = line3[0]
    street = ' '.join(line3[1:])
    
    
    
    print("First name: "+first_name, "Last name: "+last_name)
    print("Phone number: "+phone_number)
    print("House number: "+house_number, "Street: "+street)
    print()
    """ 
    always remember to close the file
    it's like locking the file for your use. if you use it and then don't close it,
    it's like loosing the key and the door is locked. You can't open it again
    """
    
def html_to_tags(html):
    """
    a function that reads all the tags of 
    html file and returns a list of tags
    Parse the strings!
    
    Args:
        html (_type_): _description_
    """

def main():
    print("The number 1-11 is "+str(binary_to_decimal('1011')) )
    """ 
    This would also owrk when you pass a list instead of string
    It means that lists, tuples and strings are all sequences
    """
    
    
if __name__ == "__main__":
    main()
