var Promise = require('bluebird')
var minimatch = require('minimatch')
var sharp = require('sharp')
var streamToArray = require('stream-to-array')
var streamToArrayAsync = Promise.promisify(streamToArray)
var getNewPath = require('./new_path')

var include = 'content/**/*.+(png|jpg)'
var width = 900

function generateResponsiveImages() {
  const hexo = this
  const route = hexo.route
  const routes = route.list()

  return Promise.mapSeries(routes, function (filePath) {
    if (!minimatch(filePath, include)) {
      return
    }

    const stream = route.get(filePath);
    return streamToArrayAsync(stream)
      .then(function(arr) {
        if(typeof arr[0] === 'string'){
          return arr[0];
        }else{
          return Buffer.concat(arr);
        }
      }).then(function (buffer) {
        return sharp(buffer).resize(width).toBuffer()
      }).then(function (output) {
        const newPath = getNewPath(filePath, {prefix: 'thumb'})
        return hexo.route.set(newPath, output)
      })
  })
}

module.exports = generateResponsiveImages
