module.exports = function getHelper(ctx, name) {
  return ctx.extend.helper.get(name)
}
