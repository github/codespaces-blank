import text_editor as t_editor

def main():
    current_text = ""
    scrambled_text = ""
    while True:
        print("\n-------Main Menu:-------")
        print("a. Start with blank text.")
        print("b. Append to current text")
        print("c. Add text to current text at a specified position.")
        print("d. Substitute a word with another.")
        print("e. Scramble current text.")
        print("f. Unscramble current text.")
        print("g. Print current text.")
        print("h. Quit")

        user_input = str(input("Please select a option:"))

        if user_input == "a":
            current_text = str(input("Please enter the text you want to start with: "))
            print(f"The current text is: {current_text}")

        elif user_input == "b":
            append = str(input("Please enter the text you would like to append:"))
            current_text = t_editor.append(current_text, append)

        elif user_input == "c":
            insert = str(input("Please enter the text you would like to add:"))
            position = int(input("Please enter the position you would like to add the text:"))
            current_text = t_editor.add(current_text, insert, position)

        elif user_input == "d":
            substitute = str(input("Please enter the word you would like to substitute:"))
            new_word = str(input("Please enter the word you would like to substitute it with:"))
            current_text = t_editor.substitute(current_text, substitute, new_word)

        elif user_input == "e":
            scrambled_text = t_editor.scramble(current_text)
            print(f"The Scrambled text is: {scrambled_text}")

        elif user_input == "f":
            if not scrambled_text:
                print("Text has not been scrambled yet. Please scramble first.")
            else:
                unscrambled_text = t_editor.unscramble(scrambled_text)
                print(f"The Un-Scrambled text is: {unscrambled_text}")

        elif user_input == "g":
            print(f"The current text is: {current_text}")

        elif user_input == "h":
            break
        else:
            print("Please enter a valid option.")


    print("Exiting program.")

if __name__ == "__main__":
    main()
