const streamToPromise = require('stream-to-promise')

module.exports = function contentFor(ctx, path) {
  const contentStream = ctx.route.get(path)
  return streamToPromise(contentStream).then(buffers => Buffer.concat(buffers))
}
