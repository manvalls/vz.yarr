# vz Yarr [![Build Status][travis-image]][travis-url]

## Sample usage:

```javascript

var Yarr = require('vz.yarr'),
    walk = require('vz.walk'),
    yarr = new Yarr(),
    result;

walk(function*(){
  result = yield yarr.pop();
  console.log(result); // Hello world!
});

walk(function*(){
  yield yarr.push('Hello world!');
});


```

[travis-image]: https://travis-ci.org/manvalls/vz.yarr.svg?branch=master
[travis-url]: https://travis-ci.org/manvalls/vz.yarr

