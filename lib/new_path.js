const path = require('path')

function getNewPath(oldPath, options) {
  const base = path.basename(oldPath)
  const dir = path.dirname(oldPath)

  if (dir === '.') {
    return options.prefix + '_' + base
  }

  return dir + '/' + options.prefix + '_' + base
}

module.exports = getNewPath
