// this is a comment!
/* more comments! */

// you can declare a variable!
x = "hola";             // this is a string

// print its value on your standard output channel!
write(x);

// strings can be concatenated using the plus sign
x = x + " moto";
write(x);

// at any time, you can change its value and type
x = true;  write(x);    // x is a boolean now
x = 123;   write(x);    // x becomes number 123

write(5 + 5);           // numbers can be added
write(5 - 6);           // numbers can be subtracted
write(5 * 5);           // more operations are: multiplication
write(5 / 5);           // division
write(7 % 5);           // modulo

// other available data types:
x = { a: 1, b: "a string" };  write(x);   // object
x = [ 1, 2, 3 ];              write(x);   // array
x = null;                     write(x);   // null

// functions are also a type of object!
// a function declaration may look like this:
// when invoked, they may optionally return a value
function x(name) {
  return name+" as a function";
}
write( x("x") );

// anonymous functions are also available
x = function() {
  write("i am an anonymous function");
};
x();

// any function can reference itself using the 'this' keyword
// we can use 'this' to recursively calculate the factorial of a number
write(
  function(x) {
    if x <= 1 { return 1; }   //
    return this(x - 1)*x;
  }(5)  // '(5)' invokes the function right after its declaration
);

// objects are just like JSON: they contain properties, each one with a value
obj = { name: "Jon Doe", tickets: [ 5, 10, 15, 20 ] };

// and those properties can be accessed using the dot notation:
write(obj.name);

// you can stuff anything inside arrays
arr = [ { foo: obj, bar: [] }, -500, false ];
write(arr);

// 'plus' can concatenate any number of arrays into a larger one
arr = arr + [ 3, 4 ];
write(arr);

// and access elements by their index
write(arr[4]);

// array and object accesses can be chained like so:
x = arr[0].foo.tickets[3];
write(x);

// in case you want to iterate through all elements in an array
// use the for-in loop
for elem in arr {
  write(elem);
}

// there's also the traditional 'while' loop
// it uses boolean expressions to evaluate the condition
// available bool operators are 'not', 'and', 'or'
// number comparisons can also evaluate the condition
// ('==', '!=', '<', '>', '<=', '>=')
i = 0;
food = [ "pizza", "chips", "whale" ];
hungry = true;
while hungry {
  write("eat "+food[i]+" now!");
  i = i + 1;
  hungry = i != 3;
}

// if-elsif-else statements
sat = 0;
if not true {
  sat = 1;
} elsif i == 2 {
  sat = 2;
} else {
  sat = i;
}
write(sat);


/*

Output for the above script:
----------------------------

>> hola
>> hola moto
>> true
>> 123
>> 10
>> -1
>> 25
>> 1
>> 2
>> {"a":1,"b":"a string"}
>> [1,2,3]
>> null
>> x as a function
>> i am an anonymous function
>> 120
>> Jon Doe
>> [{"foo":{"name":"Jon Doe","tickets":[5,10,15,20]},"bar":[]},-500,false]
>> [{"foo":{"name":"Jon Doe","tickets":[5,10,15,20]},"bar":[]},-500,false,3,4]
>> 4
>> 20
>> {"foo":{"name":"Jon Doe","tickets":[5,10,15,20]},"bar":[]}
>> -500
>> false
>> 3
>> 4
>> eat pizza now!
>> eat chips now!
>> eat whale now!
>> 3

*/

