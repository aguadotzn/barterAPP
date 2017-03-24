"use strict";

var getType = function( value ) {
  return {}.toString.call( value );
};

module.exports.getType = getType;
