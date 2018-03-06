module.exports = function mockConfig(ctx, name, value) {
  ctx.config[name] = value
}
