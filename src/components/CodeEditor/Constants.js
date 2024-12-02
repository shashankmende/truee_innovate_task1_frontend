
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



// export const CODE_SNIPPETS = {
//   javascript: `
// function greet(name) {
//     console.log("Hello, " + name + "!");
// }

// greet("Alex");
// `,

//   python: `
// def greet(name):
//     print("Hello, " + name + "!")

// greet("Alex")
// `,

//   java: `
// public class HelloWorld {
//     public static void main(String[] args) {
//         System.out.println("Hello, Alex!");
//     }
// }
// `,

//   html: `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Hello World</title>
// </head>
// <body>
//     <h1>Hello, Alex!</h1>
// </body>
// </html>
// `,

//   css: `
// body {
//     font-family: Arial, sans-serif;
//     background-color: #f0f0f0;
//     color: #333;
//     text-align: center;
//     margin: 0;
//     padding: 0;
// }

// h1 {
//     color: #007BFF;
// }
// `,

//   cpp: `
// #include <iostream>
// using namespace std;

// int main() {
//     cout << "Hello, Alex!" << endl;
//     return 0;
// }
// `,

//   ruby: `
// def greet(name)
//     puts "Hello, #{name}!"
// end

// greet("Alex")
// `,

//   php: `
// <?php

// $name = "Alex";
// echo "Hello, " . $name . "!";

// ?>
// `,

//   swift: `
// import Foundation

// func greet(name: String) {
//     print("Hello, \\(name)!")
// }

// greet(name: "Alex")
// `,

//   kotlin: `
// fun main() {
//     println("Hello, Alex!")
// }
// `,

//   scala: `
// object HelloWorld {
//   def main(args: Array[String]): Unit = {
//     println("Hello, Alex!")
//   }
// }
// `,

//   objective_c: `
// #import <Foundation/Foundation.h>

// int main(int argc, const char * argv[]) {
//     @autoreleasepool {
//         NSLog(@"Hello, Alex!");
//     }
//     return 0;
// }
// `,
// };



export const languageOptions = [
  {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript",
  },
  {
    id: 45,
    name: "Assembly (NASM 2.14.02)",
    label: "Assembly (NASM 2.14.02)",
    value: "assembly",
  },
  {
    id: 46,
    name: "Bash (5.0.0)",
    label: "Bash (5.0.0)",
    value: "bash",
  },
  {
    id: 47,
    name: "Basic (FBC 1.07.1)",
    label: "Basic (FBC 1.07.1)",
    value: "basic",
  },
  {
    id: 75,
    name: "C (Clang 7.0.1)",
    label: "C (Clang 7.0.1)",
    value: "c",
  },
  {
    id: 76,
    name: "C++ (Clang 7.0.1)",
    label: "C++ (Clang 7.0.1)",
    value: "cpp",
  },
  {
    id: 48,
    name: "C (GCC 7.4.0)",
    label: "C (GCC 7.4.0)",
    value: "c",
  },
  {
    id: 52,
    name: "C++ (GCC 7.4.0)",
    label: "C++ (GCC 7.4.0)",
    value: "cpp",
  },
  {
    id: 49,
    name: "C (GCC 8.3.0)",
    label: "C (GCC 8.3.0)",
    value: "c",
  },
  {
    id: 53,
    name: "C++ (GCC 8.3.0)",
    label: "C++ (GCC 8.3.0)",
    value: "cpp",
  },
  {
    id: 50,
    name: "C (GCC 9.2.0)",
    label: "C (GCC 9.2.0)",
    value: "c",
  },
  {
    id: 54,
    name: "C++ (GCC 9.2.0)",
    label: "C++ (GCC 9.2.0)",
    value: "cpp",
  },
  {
    id: 86,
    name: "Clojure (1.10.1)",
    label: "Clojure (1.10.1)",
    value: "clojure",
  },
  {
    id: 51,
    name: "C# (Mono 6.6.0.161)",
    label: "C# (Mono 6.6.0.161)",
    value: "csharp",
  },
  {
    id: 77,
    name: "COBOL (GnuCOBOL 2.2)",
    label: "COBOL (GnuCOBOL 2.2)",
    value: "cobol",
  },
  {
    id: 55,
    name: "Common Lisp (SBCL 2.0.0)",
    label: "Common Lisp (SBCL 2.0.0)",
    value: "lisp",
  },
  {
    id: 56,
    name: "D (DMD 2.089.1)",
    label: "D (DMD 2.089.1)",
    value: "d",
  },
  {
    id: 57,
    name: "Elixir (1.9.4)",
    label: "Elixir (1.9.4)",
    value: "elixir",
  },
  {
    id: 58,
    name: "Erlang (OTP 22.2)",
    label: "Erlang (OTP 22.2)",
    value: "erlang",
  },
  {
    id: 44,
    label: "Executable",
    name: "Executable",
    value: "exe",
  },
  {
    id: 87,
    name: "F# (.NET Core SDK 3.1.202)",
    label: "F# (.NET Core SDK 3.1.202)",
    value: "fsharp",
  },
  {
    id: 59,
    name: "Fortran (GFortran 9.2.0)",
    label: "Fortran (GFortran 9.2.0)",
    value: "fortran",
  },
  {
    id: 60,
    name: "Go (1.13.5)",
    label: "Go (1.13.5)",
    value: "go",
  },
  {
    id: 88,
    name: "Groovy (3.0.3)",
    label: "Groovy (3.0.3)",
    value: "groovy",
  },
  {
    id: 61,
    name: "Haskell (GHC 8.8.1)",
    label: "Haskell (GHC 8.8.1)",
    value: "haskell",
  },
  {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
    label: "Java (OpenJDK 13.0.1)",
    value: "java",
  },

  {
    id: 78,
    name: "Kotlin (1.3.70)",
    label: "Kotlin (1.3.70)",
    value: "kotlin",
  },
  {
    id: 64,
    name: "Lua (5.3.5)",
    label: "Lua (5.3.5)",
    value: "lua",
  },

  {
    id: 79,
    name: "Objective-C (Clang 7.0.1)",
    label: "Objective-C (Clang 7.0.1)",
    value: "objectivec",
  },
  {
    id: 65,
    name: "OCaml (4.09.0)",
    label: "OCaml (4.09.0)",
    value: "ocaml",
  },
  {
    id: 66,
    name: "Octave (5.1.0)",
    label: "Octave (5.1.0)",
    value: "octave",
  },
  {
    id: 67,
    name: "Pascal (FPC 3.0.4)",
    label: "Pascal (FPC 3.0.4)",
    value: "pascal",
  },
  {
    id: 85,
    name: "Perl (5.28.1)",
    label: "Perl (5.28.1)",
    value: "perl",
  },
  {
    id: 68,
    name: "PHP (7.4.1)",
    label: "PHP (7.4.1)",
    value: "php",
  },
  {
    id: 43,
    label: "Plain Text",
    name: "Plain Text",
    value: "text",
  },
  {
    id: 69,
    name: "Prolog (GNU Prolog 1.4.5)",
    label: "Prolog (GNU Prolog 1.4.5)",
    value: "prolog",
  },
  {
    id: 70,
    name: "Python (2.7.17)",
    label: "Python (2.7.17)",
    value: "python",
  },
  {
    id: 71,
    name: "Python (3.8.1)",
    label: "Python (3.8.1)",
    value: "python",
  },
  {
    id: 80,
    name: "R (4.0.0)",
    label: "R (4.0.0)",
    value: "r",
  },
  {
    id: 72,
    name: "Ruby (2.7.0)",
    label: "Ruby (2.7.0)",
    value: "ruby",
  },
  {
    id: 73,
    name: "Rust (1.40.0)",
    label: "Rust (1.40.0)",
    value: "rust",
  },
  {
    id: 81,
    name: "Scala (2.13.2)",
    label: "Scala (2.13.2)",
    value: "scala",
  },
  {
    id: 82,
    name: "SQL (SQLite 3.27.2)",
    label: "SQL (SQLite 3.27.2)",
    value: "sql",
  },
  {
    id: 83,
    name: "Swift (5.2.3)",
    label: "Swift (5.2.3)",
    value: "swift",
  },
  {
    id: 74,
    name: "TypeScript (3.7.4)",
    label: "TypeScript (3.7.4)",
    value: "typescript",
  },
  {
    id: 84,
    name: "Visual Basic.Net (vbnc 0.0.0.5943)",
    label: "Visual Basic.Net (vbnc 0.0.0.5943)",
    value: "vbnet",
  },
];


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

  bash: `
#!/bin/bash
echo "Hello, Alex!"
`,

  c: `
#include <stdio.h>

int main() {
    printf("Hello, Alex!\\n");
    return 0;
}
`,

  clojure: `
(println "Hello, Alex!")
`,

  go: `
package main

import "fmt"

func main() {
    fmt.Println("Hello, Alex!")
}
`,

  haskell: `
main :: IO ()
main = putStrLn "Hello, Alex!"
`,

  perl: `
print "Hello, Alex!\\n";
`,

  rust: `
fn main() {
    println!("Hello, Alex!");
}
`,

  typescript: `
function greet(name: string): void {
    console.log(\`Hello, \${name}!\`);
}

greet("Alex");
`,

  sql: `
SELECT 'Hello, Alex!' AS greeting;
`,

  fortran: `
PROGRAM HelloAlex
    PRINT *, 'Hello, Alex!'
END PROGRAM HelloAlex
`,

  lisp: `
(format t "Hello, Alex!~%")
`,

  vbnet: `
Module HelloWorld
    Sub Main()
        Console.WriteLine("Hello, Alex!")
    End Sub
End Module
`,

  pascal: `
program HelloAlex;
begin
    writeln('Hello, Alex!');
end.
`,

  lua: `
print("Hello, Alex!")
`,

  d: `
import std.stdio;

void main() {
    writeln("Hello, Alex!");
}
`,

  groovy: `
println "Hello, Alex!"
`,

  r: `
cat("Hello, Alex!\\n")
`,

  prolog: `
hello :- write('Hello, Alex!'), nl.
`
};
