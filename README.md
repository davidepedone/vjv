vjv
===

[![Build Status](https://travis-ci.org/davidepedone/vjv.svg?branch=master)](http://travis-ci.org/davidepedone/vjv)
[![NPM version](https://badge.fury.io/js/vjv.svg)](http://badge.fury.io/js/vjv)


[![NPM](https://nodei.co/npm/vjv.png?downloads=true&stars=true)](https://nodei.co/npm/vjv/)

VarArgs to JSON / JSON to VarArgs node module

# Install

```bash
  npm install vjv
```

# Examples:

## Initialize (Get singleton instance):

```js
var vjv = require('vjv');
```

### Configuration

- `arraySeparator`: Default |
- `stringWrapper`: Default "
- `doubledash`: used only when converting from JSON to varargs. Default false
- `commandPrefix`: Default cmd 

```js
var vjv = require('vjv');
vjv.config({arraySeparator:'@',stringWrapper:'#',commandPrefix:'command'});
```

## JSON To VarArgs (j2v)
`varargs = vjv.j2v(json)`

Parse JSON and return command line string.

```js
json = {cmd:'command',a:'string',b:false,c:0,d:['item1','item2'],e:'a value with spaces'};
varargs = vjv.j2v(json);
// command -a string -b false -c 0 -d item1|item2 -e "a value with spaces"
```

## VarArgs To JSON (v2j)
`json = vjv.v2j(varargs,command)`

Parse command line string and return JSON.

```js
varargs = 'acommand -a #custom string wrapper# -b #array of#@#custom string#@wrapper';
// configure options
vjv.config({arraySeprator:'@',stringWrapper:'#',commandPrefix:'cmdPrefix'});
json = vjv.v2j(varargs,'acommand');
// {cmdPrefix:'acommand',a:'custom string wrapper',b:['array of','custom string','wrapper']}
```

## Release History
|Version|Date|Description|
|:--:|:--:|:--|
|v0.2.0|2014-07-23|Custom command prefix option|
|v0.1.0|2014-07-23|First release|

[![NPM](https://nodei.co/npm-dl/vjv.png?months=6)](https://nodei.co/npm/vjv/)

# License 

(The MIT License)

Copyright (c) 2014 Davide Pedone &lt;davide.pedone (at) gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
