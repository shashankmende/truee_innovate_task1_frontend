
export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  html: "5.0",
  css: "3.0",
  cpp: "17",
  ruby: "3.2.0",
  swift: "5.8.0",
  kotlin: "1.8.0",
  scala: "3.3.0",
  objective_c: "2.0"
};


export const CODE_SNIPPETS = {
  javascript: `
function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("Alex");
`,

  python: `
def greet(name):
    print("Hello, " + name + "!")

greet("Alex")
`,

  java: `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Alex!");
    }
}
`,

  html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, Alex!</h1>
</body>
</html>
`,

  css: `
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    color: #333;
    text-align: center;
    margin: 0;
    padding: 0;
}

h1 {
    color: #007BFF;
}
`,

  cpp: `
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Alex!" << endl;
    return 0;
}
`,

  ruby: `
def greet(name)
    puts "Hello, #{name}!"
end

greet("Alex")
`,

  php: `
<?php

$name = "Alex";
echo "Hello, " . $name . "!";

?>
`,

  swift: `
import Foundation

func greet(name: String) {
    print("Hello, \\(name)!")
}

greet(name: "Alex")
`,

  kotlin: `
fun main() {
    println("Hello, Alex!")
}
`,

  scala: `
object HelloWorld {
  def main(args: Array[String]): Unit = {
    println("Hello, Alex!")
  }
}
`,

  objective_c: `
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSLog(@"Hello, Alex!");
    }
    return 0;
}
`,
};

// export const LANGUAGE_VERSIONS = {
//     javascript: "18.15.0",
//     typescript: "5.0.3",
//     python: "3.10.0",
//     java: "15.0.2",
//     csharp: "6.12.0",
//     php: "8.2.3",
//   };

//   export const CODE_SNIPPETS = {
//     javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
//     typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
//     python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
//     java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
//     csharp:
//       'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
//     php: "<?php\n\n$name = 'Alex';\necho $name;\n",
//   };
