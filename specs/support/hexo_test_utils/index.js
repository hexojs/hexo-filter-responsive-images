const Hexo = require('hexo')
const path = require('path')

function createHexoSandbox(options) {
  return function init (name) {
    const ctx = new Hexo(path.join(options.fixture_folder, name))
    ctx.init()

    options.plugins.forEach(pluginPath => {
      ctx.loadPlugin(pluginPath)
    })

    return ctx
  }
}

module.exports = {
  createHexoSandbox: createHexoSandbox
}
