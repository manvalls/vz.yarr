var Yarr,
    Property = require('vz.property'),
    Yielded = require('vz.yielded'),
    walk = require('vz.walk'),
    Su = require('vz.rand').Su,
    
    arrays = Su(),
    awaiting = Su(),
    datas = Su();

function onConsumed(){
  this[awaiting].value = this[datas].length;
}

module.exports = Yarr = function(){
  
  this[arrays] = {
    in: [],
    datas: [],
    out: []
  };
  
};

function pushOne(data,a){
  var yd = new Yielded(),
      oyd;
  
  if(a.out.length){
    oyd = a.out.pop();
    oyd[awaiting] = yd;
    oyd[datas] = a.datas;
    oyd.on('consumed',onConsumed);
    oyd.value = data;
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
    oyd = a.out.shift();
    oyd[awaiting] = yd;
    oyd[datas] = a.datas;
    oyd.on('consumed',onConsumed);
    oyd.value = data;
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
    return walk(pushAll,[arguments,this[arrays]]);
  }},
  pop: {value: function(){
    var a = this[arrays],
        yd = new Yielded();
    
    if(a.in.length){
      yd.value = a.datas.pop();
      yd[awaiting] = a.in.pop();
      yd[datas] = a.datas;
      yd.on('consumed',onConsumed);
    }else a.out.push(yd);
    
    return yd;
  }},
  shift: {value: function(){
    var a = this[arrays],
        yd = new Yielded();
    
    if(a.in.length){
      yd.value = a.datas.shift();
      yd[awaiting] = a.in.shift();
      yd[datas] = a.datas;
      yd.on('consumed',onConsumed);
    }else a.out.unshift(yd);
    
    return yd;
  }},
  unshift: {value: function(){
    return walk(unshiftAll,[arguments,this[arrays]]);
  }},
  length: {
    get: function(){
      return this[arrays].datas.length;
    },
    set: function(length){
      length = Math.max(0,length);
      
      while(length > this.length) this.push(undefined);
      while(length < this.length) this.pop();
    }
  },
  isYarr: {value: true}
});

