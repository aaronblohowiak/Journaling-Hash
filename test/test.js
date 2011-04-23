var assert = require("assert"),
    JH = require("../index.js");

var cnt = 0;

(function(){
  //avoid typing assert.blah all over
  for(k in assert){
    this[k] = assert[k];
  }  
})();

function name(){
  return ("jh"+cnt);
}

var jh;

jh = new JH();
ok(true, "should be happy to make a new JH without params");

jh = new JH("test");
equal(jh.name(),"test", "name of the hash should be tracked");

jh = new JH("config", {"option1": "pants"});
equal(jh.get("option1"), "pants", "simple object setting on construction");

jh = new JH("config", {"option1": "pants"});
deepEqual(jh.history("option1"), [[JSON.stringify("pants"), "default"]], "should record initial values as default.");

throws(function(){
  var jh = new JH("config", {"option1": "pants"});
  jh.set({"option1": "terrible"});
}, "require a source of overrides");

jh = new JH("config", {"option1": "pants"});
jh.set({"option1": "pantalones"}, "customization");
equal(jh.get("option1"), "pantalones", "overriding should work");
deepEqual(jh.history("option1"), 
  [[JSON.stringify("pants"), "default"], 
  [JSON.stringify("pantalones"), "customization"]],
  "should record successive settings' source");


jh = new JH("config", {nested:{opt:"val"}});
jh.get("nested").opt = "val2";
deepEqual(jh.get("nested"), {opt:"val"}, "should always copy objects");

jh = new JH("config", {a:[1,2], b:[99]});
jh.push({a:3, b:100, c:3.14}, "latest data");
deepEqual(jh.getAll(), {a:[1,2,3], b:[99, 100], c:[3.14]}, "should push new values to the end of old ones")


console.log("ok");