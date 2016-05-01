# GdbScript

A simple scripting language to interface with GDB


## Overview

```javascript
// this is a comment!
/* more comments! */
```
You can declare a variable!
```javascript
x = "hola";    // this is a string
```

Print its value on your standard output channel
```javascript
write(x);
```
Output resulting from GdbScript commands is prefixed with `>> `
```javascript
>> hola
```

Strings can be concatenated using the plus sign
```javascript
x = x + " moto";  write(x);
>> hola moto
```

At any time, you can change its value and type
```javascript
x = true;  write(x);    // x is a boolean now
>> true
x = 123;   write(x);    // x becomes number 123
>> 123
```

```javascript
write(5 + 5);           // numbers can be added
>> 10
write(5 - 6);           // numbers can be subtracted
>> -1
write(5 * 5);           // more operations are: multiplication
>> 25
write(5 / 5);           // division
>> 1
write(7 % 5);           // modulo
>> 2
```

Other available data types
```javascript
x = { a: 1, b: "a string" };  write(x);   // object
>> {"a":1,"b":"a string"}
x = [ 1, 2, 3 ];              write(x);   // array
>> [1,2,3]
x = null;                     write(x);   // null
>> null
```

Functions are also a data type! When invoked, they may optionally return a value. A function declaration looks like this

```javascript
function x(name) {
  return name+" as a function";
}
write( x("x") );
>> x as a function
```

Anonymous functions are also available
```javascript
x = function() {
  write("i am an anonymous function");
};
x();
>> i am an anonymous function
```

Any function can reference itself using the 'this' keyword. We can use 'this' to recursively calculate the factorial of a number
```javascript
write(
  function(x) {
    if x <= 1 { return 1; }
    return this(x - 1)*x;
  }(5)  // '(5)' invokes the function right after its declaration
);
>> 120
```

Objects are just like JSON: they contain properties, each one with a value
```javascript
obj = { name: "Jon Doe", tickets: [ 5, 10, 15, 20 ] };
```

And those properties can be accessed using the dot notation
```javascript
write(obj.name);
>> Jon Doe
```

You can stuff anything inside arrays
```javascript
arr = [ { foo: obj, bar: [] }, -500, false ];
write(arr);
>> [{"foo":{"name":"Jon Doe","tickets":[5,10,15,20]},"bar":[]},-500,false]
```

And access elements by their index
```javascript
write(arr[2]);
>> false
```

'plus' can concatenate any number of arrays into a larger one
```javascript
arr = arr + [ 3, 4 ];
write(arr);
>> [{"foo":{"name":"Jon Doe","tickets":[5,10,15,20]},"bar":[]},-500,false,3,4]
```

Array and object accesses can be chained like so
```javascript
x = arr[0].foo.tickets[3];
write(x);
>> 20
```

In case you want to iterate through all elements in an array, use the for-in loop
```javascript
for elem in arr {
  write(elem);
}
>> {"foo":{"name":"Jon Doe","tickets":[5,10,15,20]},"bar":[]}
>> -500
>> false
>> 3
>> 4
```

There's also the traditional 'while' loop. It uses boolean expressions to evaluate the condition. Available bool operators are 'not', 'and', 'or'.
Number comparisons can also evaluate the condition ('==', '!=', '<', '>', '<=', '>=')
```javascript
i = 0;
food = [ "pizza", "chips", "whale" ];
hungry = true;
while hungry {
  write("eat "+food[i]+" now!");
  i = i + 1;
  hungry = i != 3;
}
>> eat pizza now!
>> eat chips now!
>> eat whale now!
```

If-elsif-else statements
```javascript
sat = 0;
if not true {
  sat = 1;
} elsif i == 2 {
  sat = 2;
} else {
  sat = i;
}
```

## Debugging with GdbScript

In order to function correctly, GbdScript expects `gdb` to operate in asynchronous mode. So you should add these lines at the end of you `.gdbinit` file, if you haven't already:
```
set pagination off
set non-stop on
set target-async on
```

GdbScript provides a few predefined functions to help you debug. Suppose you want to debug this c++ program, `main.cc`, which calculates the factorial of 5:

```c++
#include <iostream>
using namespace std;

long long fac(unsigned int x) {
  long long res = 1;
  if (x > 1) {
    res = x * fac(x - 1);
  }
  return res;
}

int main() {
  unsigned int x = 5;
  cout<<"factorial of "<<x<<" = "<<fac(5)<<endl;
  return 0;
}
```

To start debugging, all you need to do is issue the following command
```javascript
// suppose your C++ code is in a file called 'main.cc'
// this will compile your program and start the debug session
debug("main.cc");
>> + main.cc compiled successfully
>> + debugging main.cc
>> + debugger stopped
```
GdbScript will take care of the compilation, and report any errors that may have occurred. If compilation was successful, GdbScript will start the debug, and stop at the beginning of your `main` method.

Messages from the debugger will be prefixed with a `+` if they are info; errors will come prefixed with an `*`, and application output with a `~`.
```javascript
>> + this is info
>> * this is an error
>> ~ this is output comping from the program you're debugging
```

The function `debugOut` allows you to process debugger output with more control, by defining a callback function which will run every time the debugger outputs something. 
```javascript
// whenever the debugger outputs something, this function will be called
// the 'data' variable is a plain object containing the debugger's output
debugOut(function(data) {
  write("debug " + data);
});
```
Data sent from the debugger will be passed as a regular object, with properties for you to access and print. A very simple but complete debug of the program could look like this:
```javascript
debugOut(function(data) {
  // print variable names and their values, if they are present in the output
  if data.result != null and data.result.variables != null {
    for var in data.result.variables {
      write(var.name + " = " + var.value);
    }
  }
});
>> + debugOut function set
debug("main.cc");
>> + main.cc compiled successfully
>> + debugging main.cc
>> + debugger stopped
// insert a breakpoint at line 9 (the return statement in the 'fac' method)
break(9);
>> + breakpoint inserted at line 9
// continue execution; it will stop as soon as the breakpoint is hit
cont();
>> + debugger running
>> + debugger stopped
// list variables; this time the callback will print them
vars();
>> res = 1
>> x = 1
// rinse and repeat
cont();
>> + debugger running
>> + debugger stopped
vars();
>> res = 2
>> x = 2
cont();
>> + debugger running
>> + debugger stopped
vars();
>> res = 6
>> x = 3
cont();
>> + debugger running
>> + debugger stopped
vars();
>> res = 24
>> x = 4
cont();
>> + debugger running
>> + debugger stopped
vars();
>> res = 120
>> x = 5
// this is the last iteration; the app will print the factorial, and the debug will be finished
cont();
>> + debugger running
>> ~ factorial of 5 = 120
>> ~ 
>> + debugger stopped
>> + debugger idle
```



## Installation

You will need the following software to execute GdbScript code:

- [Node.js](https://nodejs.org/)

  GdbScript is meant to run on the [Node.js](https://nodejs.org/) JavaScript runtime.

- [ANTLR](http://www.antlr.org/)
  
  GdbScript processes your code using [ANTLR](http://www.antlr.org/)'s javascript target.
  <br/>To let Node use the runtime, [download the ANTLR javascript target](http://www.antlr.org/download/antlr-javascript-runtime-4.5.2.zip), extract the `antlr4` folder somewhere on you computer, and run the following command from inside the `antlr4` folder:
  ```
  npm link antlr4
  ```
  More info at the [ANTLR javascript-target doc](https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md).
  
  
- [GCC](https://gcc.gnu.org/) and [GDB](https://www.gnu.org/s/gdb/) 

  Your c++ code is compiled and debugged using the GNU tools.




Once you have everything else, just clone this repo and you can get started!
```
git clone https://github.com/llop/GdbScript.git
```
Go into the `src` folder, and run:
```
node run.js
```
You can now run your own GdbScript code!

You may want to have a look at the [examples](https://github.com/llop/GdbScript/blob/master/) for some sample code.

