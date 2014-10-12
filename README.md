# vz Yarr

[![NPM](https://nodei.co/npm/vz.yarr.png?downloads=true)](https://nodei.co/npm/vz.yarr/)

No piece of software is ever completed, feel free to contribute and be humble

## Sample usage:

```javascript

var Yarr = require('vz.yarr'),
    walk = require('vz.walk'),
    yarr = new Yarr(),
    result;

walk(function*(){
  result = yield yarr.pop();
});

walk(function*(){
  yield yarr.push('Hello world!');
});

console.log(result); // Hello world!

```


