var Yarr,
    Yielded = require('vz.yielded'),
    walk = require('vz.walk'),
    Su = require('vz.rand').Su,
    
    data = Su(),
    queue = Su(),
    value = Su(),
    
    checkQueue = Su();

module.exports = Yarr = function Yarr(){
  this[data] = [];
  this[queue] = [];
};

function onConsumed(e,yd){
  yd.done = true;
}

Yarr.prototype[checkQueue] = function(){
  var q,d;
  
  while(this[data].length && this[queue].length){
    d = this[data].shift();
    q = this[queue].shift();
    
    q.on('consumed',onConsumed,d);
    q.value = d[value];
  }
  
};

Object.defineProperties(Yarr.prototype,{
  
  push: {value: walk.wrap(function*(){
    var i,yd,yds = [];
    
    for(i = 0;i < arguments.length;i++){
      yd = new Yielded();
      yd[value] = arguments[i];
      
      this[data].push(yd);
      yds.push(yd);
    }
    
    this[checkQueue]();
    yield yds;
    
    return this[data].length;
  })},
  unshift: {value: walk.wrap(function*(){
    var i,yd,yds = [];
    
    for(i = 0;i < arguments.length;i++){
      yd = new Yielded();
      yd[value] = arguments[i];
      
      this[data].unshift(yd);
      yds.push(yd);
    }
    
    this[checkQueue]();
    yield yds;
    
    return this[data].length;
  })},
  
  pop: {value: function(){
    var yd = new Yielded();
    
    this[queue].push(yd);
    this[checkQueue]();
    
    return yd;
  }},
  shift: {value: function(){
    var yd = new Yielded();
    
    this[queue].unshift(yd);
    this[checkQueue]();
    
    return yd;
  }},
  
  length: {
    get: function(){
      return this[data].length;
    },
    set: function(length){
      length = Math.max(0,length);
      
      while(length > this.length) this.push(undefined);
      while(length < this.length) this.pop();
    }
  },
  
  isYarr: {value: true}
});

