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

### <img alt="Python" src="https://linkpicture.com/q/python_1.svg" width=20 /> Python 

```python 
name ="Jaipal" 
print(f"Hello, my name is {name}") 
``` 

`Hello, my name is Jaipal` 


### [![Bash](https://img.shields.io/badge/--000?logo=powershell&style=plastic)](https://www.gnu.org) Bash 

```bash 
$ name = $"Jaipal"; 
$ echo "Hello World\nI am "$name; 
``` 

```bash 
Hello World 
I am Jaipal 
``` 


### <img alt="Java" src="https://linkpicture.com/q/java_1.svg" width=20 /> Java 

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
 

### <img alt="C#" src="https://linkpicture.com/q/c_1.svg" width=20 /> C 

```c 
# include <stdio.h> 
void main() { 
    printf("Hello World"); 
    return 0; 
} 
``` 

`Hello World` 


### <img alt="C++" src="https://linkpicture.com/q/c_44.png" width=20 /> C++ 

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
$ g++ -o execution_name file_name.cpp; 
$ ./execution_name 
Enter your name: Jaipal  
So, Your name is Jaipal 
``` 
  
  
### <img alt="C#" src="https://linkpicture.com/q/csharp.svg" width=20 /> C# 
  
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
  
  
### [![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff&style=plastic)](https://www.typescriptlang.org/) TypeScript 
  
```typescript 
console.log("Hello World"); 
``` 
  
`Hello World` 
  
  
### <img alt="JavaScript" src="https://linkpicture.com/q/javascript_1.svg" width=20 /> Javascript 
  
```javascript
let name= "Jaipal"; 
console.log(`Hello World\nI am ${name}`); 
``` 
  
```bash 
Hello World 
I am Jaipal 
```

### <img alt="ReactJS" src="https://linkpicture.com/q/react.png" width=20 /> ReactJS 

```jsx
function Divs({values}) {
    return(
    <div className="Div">
    {values}
    </div>
    );
}
function Hello() {
    return (
    <div>
        <Divs values="Hello World" />
    </div>
    );
}
```

`Hello World`

  
### <img alt="PHP" src="https://linkpicture.com/q/php.svg" width=20 /> PHP 
  
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
  
  
### <img alt="Ruby" src="https://linkpicture.com/q/ruby_1.png" width=20 /> Ruby 
  
```ruby 
puts "Hello World"; 
``` 
  
`Hello World` 
  
  
### Pascal 
  
```pas 
program Hello; 
begin  
    writeln("Hello World"); 
end 
 ``` 
  
`Hello World` 
  
  
### [![Assembly](https://img.shields.io/badge/ASM-fff?style=plastic)](https://en.m.wikipedia.org/wiki/Assembly_language) Assembly 
  
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
  
  
### [![R](https://img.shields.io/badge/--000?logo=r&style=plastic)](https://www.r-project.org) R 
  
```r 
cat("Hello World") 
``` 
  
`Hello World` 
  
  
### ![Rust](https://img.shields.io/badge/--101010?logo=rust&style=plastic&logoColor=c25a10) Rust 
  
```rs
fn main() { 
    println!("Hello World"); 
} 
``` 
  
`Hello World` 
  
  
### <img alt="C#" src="https://linkpicture.com/q/swift_1.png" width=20 /> Swift 
  
```swift 
println("Hello World"); 
``` 
  
`Hello World` 
  
  
### <img alt="Kotlin" src="https://linkpicture.com/q/kotlin.svg" width=20 /> Kotlin 
  
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
  
### <img alt="HTML" src="https://linkpicture.com/q/html.svg" width=20 /> HTML 
 
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
  
  
### <img alt="C#" src="https://linkpicture.com/q/css.svg" width=20 /> CSS 
  
```css 
.div:hover{ 
    content: "Hello World";
} 
 ``` 
  
`Hello World`
