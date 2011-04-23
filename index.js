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

  this.get = function(name){ return JSON.parse(jh[name]); }
  this.set = function(props, debugInfo){
    if(!debugInfo) throw("someone called set() without passing in debugInfo!");
    
    var p;
    for(key in props){
      if(props.hasOwnProperty(key)){
        p = JSON.stringify(props[key]);
        jh[key] = p;
        history[key] || (history[key] = []);
        history[key].push([p, debugInfo]);
      }
    }
  };
  
  this.toJSON = function(){
    var ret = {};
    for(key in jh){
      ret[key] = JSON.parse(jh[key]);
    }

    return JSON.stringify(jh);
  };

  this.set(props, "default");
  return this;
}

module.exports = JournalingHash;