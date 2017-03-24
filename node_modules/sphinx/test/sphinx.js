"use strict";

var fs     = require( "fs" );
var should = require( "should" );
var sphinx = require( "../lib/sphinx.js" );

describe( "sphinx", function () {

  it( "should update property values that are of the same type.", function( done ) {
    var destination = { a: "foo", b: 1, c: [ "foo" ], d: {}, e: "baz" };
    var source = { a: "bar", b: 2, c: [ "bar" ], d: {} };
    var expected  = { a: "bar", b: 2, c: [ "bar" ], d: {}, e: "baz" };

    sphinx.merge( destination, source ).should.eql( expected );
    done();
  });

  it( "should NOT update property values that are of a different type.", function( done ) {
    var destination = { a: "foo", b: 1 };
    var source = { a: 1, b: 2 };

    should( function() { sphinx.merge( destination, source ); } ).throw();
    done();
  });

  it( "should NOT add properties that do not exist already.", function( done ) {
    var destination = { a: "foo" };
    var source = { a: "foo", b: "bar" };

    should( function() { sphinx.merge( destination, source ); } ).throw();
    done();
  });

});
