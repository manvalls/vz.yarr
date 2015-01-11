var test = require('vz.test'),
    Yarr = require('./main.js'),
    assert = require('assert');

test('Main methods',function(){
  test("'push' and 'pop'",function(){
    
    test('push -> pop',function*(){
      var yarr = new Yarr(),
          yd,result;
      
      yd = yarr.push('test');
      assert(!yd.done);
      
      result = yield yarr.pop();
      yield yd;
      
      assert.equal('test',result);
    });
    
    test('pop -> push',function*(){
      var yarr = new Yarr(),
          yd,yd2,result;
      
      yd = yarr.pop();
      yd2 = yarr.push('test');
      
      assert(!yd2.done);
      result = yield yd;
      yield yd2;
      
      assert.equal('test',yield yd);
    });
    
    test('unshift -> shift',function*(){
      var yarr = new Yarr(),
          yd,result;
      
      yd = yarr.unshift('test');
      assert(!yd.done);
      
      result = yield yarr.shift();
      yield yd;
      
      assert.equal('test',result);
    });
    
    test('shift -> unshift',function*(){
      var yarr = new Yarr(),
          yd,yd2,result;
      
      yd = yarr.shift();
      yd2 = yarr.unshift('test');
      
      assert(!yd2.done);
      result = yield yd;
      yield yd2;
      
      assert.equal('test',yield yd);
    });
    
    test('Mixed',function(){
      
      test('Write first',function*(){
        var yarr = new Yarr(),result = '',i;
        
        yarr.push(1);     // 1
        yarr.unshift(2);  // 2,1
        yarr.unshift(3);  // 3,2,1
        yarr.push(0);     // 3,2,1,0
        yarr.push(-1);    // 3,2,1,0,-1
        
        result += (yield yarr.pop());         // -1
        result += ',' + (yield yarr.shift()); // -1,3
        result += ',' + (yield yarr.shift()); // -1,3,2
        result += ',' + (yield yarr.pop());   // -1,3,2,0
        result += ',' + (yield yarr.pop());   // -1,3,2,0,1
        
        assert.equal(result,'-1,3,2,0,1');
      });
      
      test('Read first',function*(){
        var yarr = new Yarr(),results = [];
        
        results.push(yarr.pop());
        results.push(yarr.shift());
        results.push(yarr.shift());
        results.push(yarr.pop());
        results.push(yarr.pop());
        
        yarr.push(1);
        yarr.unshift(2);
        yarr.unshift(3);
        yarr.push(0);
        yarr.push(-1);
        
        assert.equal((yield results).join(','),'-1,3,2,0,1');
      });
      
    });
    
  });
});

test("'untilData' and 'untilQueued'",function(){
  
  test("'untilData'",function*(){
    var yarr = new Yarr(),yd;
    
    yd = yarr.untilData();
    assert(!yd.done);
    yarr.push('test');
    yield yd;
  });
  
  test("'untilQueued'",function*(){
    var yarr = new Yarr(),yd;
    
    yd = yarr.untilQueued();
    assert(!yd.done);
    yarr.pop();
    yield yd;
  });
  
});

test("'insist'",function*(){
  var yarr = new Yarr(),i,result = '';
  
  yarr.insist(1,2,3);
  
  for(i = 0;i < 4;i++) result += yield yarr.pop();
  for(i = 0;i < 4;i++) result += yield yarr.shift();
  
  assert.equal('12312312',result);
});

test("'pipe'",function*(){
  var from = new Yarr(),
      to1 = new Yarr(),
      to2 = new Yarr(),
      i;
  
  for(i = 0;i < 5;i++) from.push(i);
  
  from.pipe(to1,to2);
  
  for(i = 0;i < 5;i++){
    assert.equal(i,yield to1.shift());
    assert.equal(i,yield to2.shift());
  }
  
});

test("'length'",function(){
  
  test('get',function*(){
    var yarr = new Yarr(),i;
    
    for(i = 0;i < 5;i++) yarr.push(i);
    assert.equal(yarr.length,5);
  });
  
  test('set',function(){
    
    test('More than initial',function*(){
      var yarr = new Yarr(),i;
      
      yarr.length = 5;
      for(i = 0;i < 5;i++) assert.equal((yield yarr.shift()),undefined);
    });
    
    test('Less than initial',function*(){
      var yarr = new Yarr(),i;
      
      for(i = 0;i < 5;i++) yarr.push(i);
      yarr.length = 3;
      yarr.push('test');
      
      for(i = 0;i < 3;i++) assert.equal(i,yield yarr.shift());
      assert.equal('test',yield yarr.shift());
    });
    
  });
  
});

test("'isYarr'",function(){
  var yarr = new Yarr();
  
  assert(yarr.isYarr);
});

