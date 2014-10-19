var Yarr,
    Property = require('vz.property'),
    Yielded = require('vz.yielded'),
    walk = require('vz.walk'),
    arrays = new Property();

module.exports = Yarr = function(){
  
  arrays.set(this,{
    in: [],
    datas: [],
    out: []
  });
  
};

function pushOne(data,a){
  var yd = new Yielded();
  
  if(a.out.length){
    a.out.pop().value = data;
    yd.value = null;
  }else{
    a.in.push(yd);
    a.datas.push(data);
  }
  
  return yd;
}

function* pushAll(datas,a){
  var yds = [],i;
  
  for(i = 0;i < datas.length;i++) yds.push(pushOne(datas[i],a));
  for(i = 0;i < yds.length;i++) yield yds[i];
}

function unshiftOne(data,a){
  var yd = new Yielded();
  
  if(a.out.length){
    a.out.shift().value = data;
    yd.value = null;
  }else{
    a.in.unshift(yd);
    a.datas.unshift(data);
  }
  
  return yd;
}

function* unshiftAll(datas,a){
  var yds = [],i;
  
  for(i = datas.length - 1;i >= 0;i--) yds.push(unshiftOne(datas[i],a));
  for(i = 0;i < yds.length;i++) yield yds[i];
}

Object.defineProperties(Yarr.prototype,{
  push: {value: function(){
    return walk(pushAll,[arguments,arrays.get(this)]);
  }},
  pop: {value: function(){
    var a = arrays.get(this),
        yd = new Yielded();
    
    if(a.in.length){
      yd.value = a.datas.pop();
      a.in.pop().value = this.length;
    }else a.out.push(yd);
    
    return yd;
  }},
  shift: {value: function(){
    var a = arrays.get(this),
        yd = new Yielded();
    
    if(a.in.length){
      yd.value = a.datas.shift();
      a.in.shift().value = this.length;
    }else a.out.unshift(yd);
    
    return yd;
  }},
  unshift: {value: function(){
    return walk(unshiftAll,[arguments,arrays.get(this)]);
  }},
  length: {
    get: function(){
      return arrays.get(this).datas.length;
    },
    set: function(length){
      length = Math.max(0,length);
      // TODO
    }
  },
  isYarr: {value: true}
});

