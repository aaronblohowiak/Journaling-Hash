var slice = Array.prototype.slice;

//[name], [initial properties]

function JournalingHash(){
  var jh = {};
  var name = "";
  var history = {};
  var props = {};
  var args = slice.call(arguments);

  this.name = function(){ return name; }
  this.history = function(name){ return history[name]; }

  if(typeof(args[0]) == "string"){
    name = args.shift();
  }
  
  if(typeof(args[0]) == "object"){
    props = args.shift();
  }

  this.get = function(name){ if(jh[name]){return JSON.parse(jh[name]); } }
  this.set = function(props, debugInfo){
    if(!debugInfo) throw("someone called set() without passing in debugInfo!");
    
    var p;
    for(var key in props){
      if(props.hasOwnProperty(key)){
        p = JSON.stringify(props[key]);
        jh[key] = p;
        history[key] || (history[key] = []);
        history[key].push([p, debugInfo]);
      }
    }
  };
  
  //props, debugInfo
  this.push = function(props, debugInfo){
    if(!debugInfo) throw("someone called push() without passing in debugInfo!");
    
    var ary, obj={};
    
    for(var name in props){
      if(props.hasOwnProperty(name)){
        ary = this.get(name) || [];
        ary = ary.concat(props[name]);
        obj[name] = ary;
      }
    }
    
    this.set(obj, debugInfo);
  };
  
  
  var innerMerge = function(dest, props){
    
    if(Array.isArray(dest)){
      return dest.concat(props);
    }
    
    if(typeof(dest) == "object"){
      var ret = {};
      for(var key in props){
        if(props.hasOwnProperty(key)){
          ret[key] = innerMerge(dest[key], props[key]);
        }
      }
      
      return ret;
    }
    
    return props;
  };
  
  this.merge = function(props, debugInfo){
    if(!debugInfo) throw("someone called merge() without passing in debugInfo!");
    
    var ary, obj={};
    
    for(var name in props){
      if(props.hasOwnProperty(name)){
        obj[name] = innerMerge(this.get(name), props[name]);
      }
    }
    
    this.set(obj, debugInfo);
  };
  
  this.getAll = function(){
    var ret = {};
    for(key in jh){
      ret[key] = JSON.parse(jh[key]);
    }
    return ret;
  };
  
  this.toJSON = function(){
    return JSON.stringify(this.getAll());
  };

  this.set(props, "default");
  return this;
}

module.exports = JournalingHash;