# Sphinx [![Build Status](https://travis-ci.org/jasonbellamy/sphinx.png?branch=master)](https://travis-ci.org/jasonbellamy/sphinx)

> Recursively merges and guards your objects against unwanted tampering.


## Features
[Sphinx](https://github.com/jasonbellamy/sphinx) guards your objects during a merge by allowing you to:

- only change the values for properties that exist on the destination object.
- only change the values for properties that are of the same type as the destination object.


## Getting Started

```
npm install --save sphinx
```


## Usage

```javascript
var sphinx = require( "sphinx" );

var destination = { foo: "bar" };
var source      = { foo: "qux" };

var merged = sphinx.merge( destination, source );
//=> { foo: "qux" }
```

## Examples

- Trying to add a property that doesn't exist on the destination object.

```javascript
var destination = { foo: "bar" };
var source      = { baz: "qux" };

var merged = sphinx.merge( destination, source );
//=> [Error: Property "baz" does not exist on destination object]
```

- Trying to merge a property of a mismatched type.

```javascript
var destination = { foo: "bar" };
var source      = { foo: 1 };

var merged = sphinx.merge( destination, source );
//=> [TypeError: Expected property "foo" to be a [object String]]
```


## API

### sphinx.merge( destination, object )

Name           | Type      | Argument     | Default | Description
---------------|-----------|--------------|---------|------------
destination    | `Object`  | `<required>` | `null`   | The destination object.  
source         | `Object`  | `<required>` | `null`   | The source object.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.


## License
Copyright (c) 2014 [Jason Bellamy ](http://jasonbellamy.com)  
Licensed under the MIT license.
