module.exports = function process(ctx) {
  return ctx.load().then(() => ctx)
}
