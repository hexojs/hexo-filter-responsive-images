module.exports = function hasRoute(ctx, path) {
  return typeof ctx.route.routes[path] !== 'undefined'
}
