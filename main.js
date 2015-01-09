var Yarr,
    Yielded = require('vz.yielded'),
    walk = require('vz.walk'),
    Su = require('vz.rand').Su,
    
    dataYd = Su(),
    queueYd = Su(),
    
    data = Su(),
    queue = Su(),
    value = Su();

module.exports = Yarr = function Yarr(){
  this[data] = [];
  this[queue] = [];
  
  this[dataYd] = new Yielded();
  this[queueYd] = new Yielded();
};

function onConsumed(e,yd){
  yd.done = true;
}

function checkQueue(yarr){
  var q,d,
      dl = yarr[data].length > 0,
      ql = yarr[queue].length > 0;
  
  if(!(dl && ql)) return;
  
  do{
    d = yarr[data].shift();
    q = yarr[queue].shift();
    
    q.on('consumed',onConsumed,d);
    q.value = d[value];
  }while(yarr[data].length && yarr[queue].length);
  
  if(yarr[data].length) yarr[dataYd].done = true;
  else if(dl) yarr[dataYd] = new Yielded();
  
  if(yarr[queue].length) yarr[queueYd].done = true;
  else if(ql) yarr[queueYd] = new Yielded();
}

Object.defineProperties(Yarr.prototype,{
  
  push: {value: walk.wrap(function*(){
    var i,yd,yds = [];
    
    if(arguments.length == 0) return;
    
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
    
    if(arguments.length == 0) return;
    
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
  
  untilData: {value: walk.wrap(function*(){
    if(!yarr[data].length) yield this[dataYd];
  })},
  untilQueued: {value: walk.wrap(function*(){
    if(!yarr[queue].length) yield this[queueYd];
  })},
  
  pipe: {value: walk.wrap(function*(){
    var i,data;
    
    while(true){
      data = yield this.shift();
      for(i = 0;i < arguments.length;i++) yield arguments[i].push(data);
    }
    
  })},
  
  insist: {value: walk.wrap(function*(){
    var i = 0;
    
    while(true){
      yield this.untilQueued();
      yield this.push(arguments[i]);
      i = (i + 1) % arguments.length;
    }
    
  })},
  
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

