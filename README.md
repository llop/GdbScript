# GdbScript

A simple scripting language to interface with GDB


## Overview

```
// this is a comment!
/* more comments! */
```
You can declare a variable!
```
x = "hola";    // this is a string
```

Print its value on your standard output channel
```
write(x);
```

Strings can be concatenated using the plus sign
```
x = x + " moto";
write(x);
```

At any time, you can change its value and type
```
x = true;  write(x);    // x is a boolean now
x = 123;   write(x);    // x becomes number 123
```

```
write(5 + 5);           // numbers can be added
write(5 - 6);           // numbers can be subtracted
write(5 * 5);           // more operations are: multiplication
write(5 / 5);           // division
write(7 % 5);           // modulo
```

Other available data types
```
x = { a: 1, b: "a string" };  write(x);   // object
x = [ 1, 2, 3 ];              write(x);   // array
x = null;                     write(x);   // null
```

Functions are also a data type! When invoked, they may optionally return a value. A function declaration may look like this

```
function x(name) {
  return name+" as a function";
}
write( x("x") );
```

Anonymous functions are also available
```
x = function() {
  write("i am an anonymous function");
};
x();
```

Any function can reference itself using the 'this' keyword. We can use 'this' to recursively calculate the factorial of a number
```
write(
  function(x) {
    if x <= 1 { return 1; }
    return this(x - 1)*x;
  }(5)  // '(5)' invokes the function right after its declaration
);
```

Objects are just like JSON: they contain properties, each one with a value
```
obj = { name: "Jon Doe", tickets: [ 5, 10, 15, 20 ] };
```

And those properties can be accessed using the dot notation
```
write(obj.name);
```

You can stuff anything inside arrays
```
arr = [ { foo: obj, bar: [] }, -500, false ];
write(arr);
```

And access elements by their index
```
write(arr[4]);
```

'plus' can concatenate any number of arrays into a larger one
```
arr = arr + [ 3, 4 ];
write(arr);
```

Array and object accesses can be chained like so
```
x = arr[0].foo.tickets[3];
write(x);
```

In case you want to iterate through all elements in an array, use the for-in loop
```
for elem in arr {
  write(elem);
}
```

There's also the traditional 'while' loop. It uses boolean expressions to evaluate the condition. Available bool operators are 'not', 'and', 'or'.
Number comparisons can also evaluate the condition ('==', '!=', '<', '>', '<=', '>=')
```
i = 0;
food = [ "pizza", "chips", "whale" ];
hungry = true;
while hungry {
  write("eat "+food[i]+" now!");
  i = i + 1;
  hungry = i != 3;
}
```

If-elsif-else statements
```
sat = 0;
if not true {
  sat = 1;
} elsif i == 2 {
  sat = 2;
} else {
  sat = i;
}
```

There are other predefined functions, besides 'write', to help us debug. The debugger operates in asyncronous mode, so first of all we need some callback functions to handle output resulting from the debug session
```
// whenever the debugger outputs anything, this function will be called
// the passed function must accept 1 argument, which will be the debugger's output
onDebugOutput(function(data) {
  write("debug " + data);
});

// whenever the application outputs anything, this function will be called
// the passed function must accept 1 argument, which will be the app's output
onAppOutput(function(data) {
  write("app " + data);
});

// whenever the debugger changes execution state (ie, it pauses because it hit a breakpoint)
// this function will be called; it must have an argument: the debugger's state
onExecStateChange(function(data) {
  write("state change " + data);
});
```

```
// suppose your C++ code is in a file called 'main.cc'
// this will compile your program and start the debug session
debug("main.cc");
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

