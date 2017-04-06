"use strict";

var utils = require( "./utils" );

var merge = function( destination, source ) {
  for ( var property in source ) {
    if ( source.hasOwnProperty( property ) ) {

      if ( !destination.hasOwnProperty( property ) ) {
        throw new Error( "Property \"" + property +"\" does not exist on destination object" );
      }

      if ( utils.getType( destination[ property ] ) !== utils.getType( source[ property ] ) ) {
        throw new TypeError( "Expected property \"" + property + "\" to be a " + utils.getType( destination[ property ] ) );
      }

      if ( utils.getType( source[ property ] ) === "[object Object]" ) {
        merge( destination[ property ], source[ property ] );
        continue;
      }

      destination[property] = source[ property ];
    }
  }
  return destination;
};

module.exports.merge = merge;
