const path = require('path')

function getNewPath(oldPath, options) {
  const base = path.basename(oldPath)
  const dir = path.dirname(oldPath)

  return dir + '/' + options.prefix + '_' + base
}

module.exports = getNewPath
