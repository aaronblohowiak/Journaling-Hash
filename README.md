#Journaling-Hash
Journaling-Hash records the history of where keys are set for easy debugging.

Maintains private (closured) name, history and data objects to help you be honest =).

      JH = require('journaling-hash');
      var jh = new JH({"color": "blue"});
      jh.set({"color": "gray"}, "company settings");
      jh.set({"color": "#f0f"}, "user settings");
      jh.get("color") 
      // "#f0f"
      jh.history("color")
      // [ [ '"blue"', 'default' ],
      //  [ '"gray"', 'company settings' ],
      //  [ '"#f0f"', 'user settings' ] ]
      jh.set({"color": "black"})
      //throw('someone called set() without passing in debugInfo!');
      jh.toJSON();
      //'{"color":"#f0f"}'

## Always returns a copy

Nested objects and arrays also work the way you want, so you can't have a consumer accidentally changing the source (thereby messing up your hash without a journaled event.)

      jh = new JH("config", {nested:{opt:"val"}});
      jh.get("nested").opt = "val2";
      jh.get("nested")
      // { opt: 'val' }

## You can push values onto arrays as well.

      jh = new JH("favorite numbers", {a:[1,2], b:[99]});
      jh.push({a:3, b:100, c:3.14}, "more favorites");
      jh.toJSON();
      // '{"a":[1,2,3],"b":[99,100],"c":[3.14]}'      

#API

    var jh = new JH([name], [properties]);

`jh.set(properties, debugInfo)` - properties is a {} of properties to override on the jh, debugInfo is the information you want to put in the history for each of the properties that you are overriding.  Each value is stored after being JSON-encoded so the reference in the history is immutable.  properties is filtered with `hasOwnProperty`.

`jh.get(name)` - returns a copy of the value for the given key

`jh.history(name)` - returns the full history for the given key as an array of [value, source] tuples, sorted from oldest to newest.

`jh.getAll()` - returns all of the data, without history.

`jh.toJSON()` - returns the JSON string for the object, discarding all history information.

`jh.push(properties, debugInfo)` - `concat`'s the values of properties onto the appropriate keys.