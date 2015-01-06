var Yarr,
    Yielded = require('vz.yielded'),
    walk = require('vz.walk'),
    Su = require('vz.rand').Su,
    
    data = Su(),
    queue = Su(),
    value = Su();

module.exports = Yarr = function Yarr(){
  this[data] = [];
  this[queue] = [];
};

function onConsumed(e,yd){
  yd.done = true;
}

function checkQueue(yarr){
  var q,d;
  
  while(yarr[data].length && yarr[queue].length){
    d = yarr[data].shift();
    q = yarr[queue].shift();
    
    q.on('consumed',onConsumed,d);
    q.value = d[value];
  }
  
}

Object.defineProperties(Yarr.prototype,{
  
  push: {value: walk.wrap(function*(){
    var i,yd,yds = [];
    
    for(i = 0;i < arguments.length;i++){
      yd = new Yielded();
      yd[value] = arguments[i];
      
      this[data].push(yd);
      yds.push(yd);
    }
    
    checkQueue(this);
    
    for(i = 0;i < yds.length;i++) yield yds[i];
    
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
    
    checkQueue(this);
    
    for(i = 0;i < yds.length;i++) yield yds[i];
    
    return this[data].length;
  })},
  
  pop: {value: function(){
    var yd = new Yielded();
    
    this[queue].push(yd);
    checkQueue(this);
    
    return yd;
  }},
  shift: {value: function(){
    var yd = new Yielded();
    
    this[queue].unshift(yd);
    checkQueue(this);
    
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

