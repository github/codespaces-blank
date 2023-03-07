import text_editor as t_editor

def test_text_editor(function: str, t_original: str, t_append: str, expected: str,  position: int)->str:
    if function == "append":
        print (t_editor.append_text(t_original, t_append))



def main():
    test_text_editor("append", "Hello World", ", to NEU", "Hello World my!", 0)
    

if __name__ == "__main__": 
    main()
