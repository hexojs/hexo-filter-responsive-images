module.exports = function getHelper(ctx, name) {
  console.log('HELPR', ctx.extend.helper)
  return ctx.extend.helper.get(name)
}
