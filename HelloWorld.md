# Format

## Programming Language Name

```bash
######################################
########### Code goes here ###########
######################################
```

`Output`

**Majority of the programmes are Hello World programmes except some**


## Programming Languages:

### Python

```python
name ="Jaipal"
print(f"Hello, my name is {name}")
```

`Hello, my name is Jaipal`


### Bash

```bash
$ name = $"Jaipal";
$ echo "Hello World\nI am "$name;
```

```bash
Hello World
I am Jaipal
```


### Java

```java
import java.util.*;
public class main() {
    public static void main(String[] args) {
        System.out.println("Choose one option: \n1.Sphere \n2.Cube \n3.Cuboid \n4.Cylinder");
        System.out.print("Enter your choice(1-4): ")
        Scanner scan = new Scanner(System.in);
        int number = scan.nextInt()
        switch (number) {
            case 1:
                System.out.println("You have selected Sphere");
                break;
            case 2:
                System.out.println("You have selected Cube");
                break;
            case 3:
                System.out.println("You have selected Cuboid ");
                break;
            case 4:
                System.out.println("You have selected Cylinder ");
                break;
            default:
                System.out.println("Invalid option");
                break;
        }
    }
}
```

```bash
$ javac file_name.java
$ java file_name
Choose one option:
1.Sphere 
2.Cube 
3.Cuboid 
4.Cylinder 
Enter your choice(1-4): 1
You have selected Sphere
```


### C

```c
# include <stdio.h>
void main() {
    printf("Hello World");
    return 0;
}
```

`Hello World`


### C++

```cpp
# include <iostream>
# include <string>
int main() {
    std::string name;
    std:: cout << "Enter your name: ";
    std::cin >> name;
    std::cout << "So, your name is " << name << std::endl;
    return 0;
}
```

```bash
$ g++ -o any_name file_name.cpp;
$ ./any_name
Enter your name: Jaipal 
So, Your name is Jaipal
```


### C#

```csharp
using System;
namespace Hello{
    class welcome{
        static void Main(String[] args) {
            Console.WriteLine("Hello World");
        }
    }
}
```

`Hello World`


### TypeScript

```typescript
console.log("Hello World");
```

`Hello World`


### Javascript

```javascript
let name= "Jaipal";
console.log(`Hello World\nI am ${name}`);
```

```bash
Hello World
I am Jaipal
```


### PHP

```php
<?php
echo "Hello World";
?>
```

`Hello World`


### Scala

```scala
object HelloWorld extends App{
    printIn("Hello World");
}
```

`Hello World`


### Matlab

```matlab
disp("Hello World");
```

`Hello World`


### CoffeeScript

```coffee
console.lof "Hello World";
```

`Hello World`


### Dart

```dart
main() {
    print("Hello World");
}
```

`Hello World`


### Ruby

```ruby
puts "Hello World";
```

`Hello World`


### Pascal

```pl
program Hello;
begin 
    writeln("Hello World");
end
```

`Hello World`


### Assembly

```asm
    global _main
    extern _printf
    section .text
_main:
    push message 
    call _printf
    add  esp, 4
message:
    db   "Hello World" 12, 0
```

`Hello World`


### R

```r
cat("Hello World")
```

`Hello World`


### Rust

```rs
fn main() {
    println!("Hello World");
}
```

`Hello World`


### Swift

```swift
println("Hello World");
```

`Hello World`


### Kotlin

```kotlin
fun main(args: Array<String>) {
    println("Hello World")
}
```

`Hello World`


### GO

```go
println("Hello World");
```

`Hello World`


### Perl

```perl
print "Hello World";
```

`Hello World`


### TCL

```tcl
puts "Hello World"
```

`Hello World`


## Non Programming Languages:

### HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <p>Hello World</p>
</body>
</html>
```

`Hello World`


### CSS

```css
.div:hover{
    content: "Hello World";
}
```

`Hello World`