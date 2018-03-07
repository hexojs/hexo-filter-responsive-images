const getHelper = require('./get_helper')

module.exports = function hasHelper(ctx, name) {
  return typeof getHelper(ctx, name) !== 'undefined'
}
