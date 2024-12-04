
export const LANGUAGE_VERSIONS = {
  java: "15.0.2",
  javascript: "18.15.0",
  python: "3.10.0",
  html: "5.0",
  c:"10.2.0",
  "c++": "10.2.0",
  ruby: "3.0.1",
  php: "8.2.3",
  typescript: "5.0.3",
  swift: "5.3.3",
  kotlin: "1.8.20",
  csharp: "6.12.0",
  // "csharp.net":"5.0.201",
  scala: "3.2.2",
  "objective-c":"2.0.0"
};


export const CODE_SNIPPETS = {
  csharp:`
  using System;
namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}

  `,
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

  swift: `print("Hello, World!")
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

  "objective-c": `
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
