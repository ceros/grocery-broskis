/**************************************************************************************************
 *          Configuration
 *
 * Load the appropriate configuration file based on the value of NODE_ENV and merge it with the 
 * defaults configuration file.  Return the merged configuration object.
 *
 **************************************************************************************************/

var _ = require("lodash");
var defaults = require("./default.js");
// TECHDEBT - Assumes a development configuration file, which we removed from
// the repo to avoid secrets leakage.  Need a better way to do this.
var config = require("./" + (process.env.NODE_ENV || "development") + ".js");
module.exports = _.merge({}, defaults, config);
