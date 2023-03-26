"""
CS 5001
Pranchal Shah
HW 06
This program decodes a message using a code table.
"""


def load_code_table(code_table_as_string: str)-> dict:
    """
    Converts a code table from the format of a str to a dictionary.
    
    Pre-conditions:
        The code table must be in a valid format, with one code per line 
        and each code separated by a single ':'
    
    Args:
        code_table_as_string (str): _description_
        
    Returns:
        code_dictionary (dict): A dictionary mapping codes to characters.
    """
    code_dictionary = {}
    # split into lines
    table_lines = code_table_as_string.splitlines()
    # divide into key and value
    for each_line in table_lines:
        code, char = each_line.split(':')
        code_dictionary.update({code: char})

    return code_dictionary
    
    

def decode(code_table: dict,encoded_message: str)-> str:
    """
    Decodes an encoded message using the specified code table.
      
    Pre-conditions:
        The encoded message must be a valid binary string.
    
    Args:
        code_table (dict): A dictionary mapping codes to characters.
        encoded_message (str): The encoded message to decode.
        
    Returns:
        decoded_message (str): The decoded message.
    
    Raises:
        ValueError: If the message cannot be decoded successfully.
    """
    combined_chars = ''
    decoded_message = ''
    for each_char in encoded_message:
        if each_char != '0' and each_char != '1':
            raise ValueError("The message cannot be decoded successfully")
    
    for each_char in encoded_message:
        combined_chars = combined_chars + each_char
        for key,value in code_table.items():
            if combined_chars == value:
                decoded_message = decoded_message + key
                combined_chars = ""
            else:
                pass
    decoded_message = decoded_message.replace('\\n', '\n')
    return decoded_message
                
    
    
def main():
    with open(f"02-Decoder/decoder-files-1/code.txt", encoding='utf-8') as file:
        code_table_as_string = file.read()
    code_table = load_code_table(code_table_as_string)
    print (code_table)
    
    with open(f"02-Decoder/decoder-files-1/encoded-passage.txt", encoding='utf-8') as file:
        encoded_message = file.read()
    decoded = decode(code_table, encoded_message)
    print (decoded)
    
    
if __name__ == "__main__":
    main()