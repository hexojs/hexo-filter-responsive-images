var isArray = require('util').isArray
var Promise = require('bluebird')
var micromatch = require('micromatch')
var streamToArray = require('stream-to-array')
var streamToArrayAsync = Promise.promisify(streamToArray)
var getNewPath = require('./new_path')
var applySharpApiOptions = require('./sharp_options').applyOptions
var getResizeOptions = require('./sharp_options').getResizeOptions
var sharp = require('sharp')

function generateResponsiveImages() {
  var hexo = this
  var config = hexo.config.responsive_images || []
  var rules = config.rules ? config.rules : config
  if (!isArray(rules)) {
    rules = [rules]
  }
  var route = hexo.route
  var routes = route.list()

  return Promise.mapSeries(routes, function (filePath) {
    var sizes = getSizesFor(filePath, rules)

    if (sizes.length == 0) {
      return
    }

    var stream = route.get(filePath)
    return streamToArrayAsync(stream).then(function (arr) {
      if (typeof arr[0] === 'string') {
        return arr[0];
      } else {
        return Buffer.concat(arr);
      }
    }).then(function (buffer) {
      return Promise.mapSeries(sizes, function (sizeSets) {
        return Promise.mapSeries(Object.keys(sizeSets), function (name) {
          var newPath = getNewPath(filePath, { prefix: name })
          return resizeImageFn(hexo, buffer, sizeSets[name]).then(function (buffer) {
            route.set(newPath, buffer)
          })
        })
      })
    })
  })
}

function getSizesFor(filePath, rules) {
  return rules.reduce(function (sizes, rule) {
    var pattern = rule.pattern || ''

    if (micromatch.isMatch(filePath, pattern)) {
      return sizes.concat(rule.sizes || [])
    }
    return sizes
  }, [])
}

function resizeImageFn(hexo, buffer, config) {
  var img = sharp(buffer).rotate()
  var resizeOptions = getResizeOptions(hexo, config)

  return new Promise(function (resolve) {
    applySharpApiOptions(img, config)
      .resize(config.width, config.height, resizeOptions)
      .toBuffer()
      .then(function (buffer) {
        resolve(buffer)
      })
  })
}

module.exports = generateResponsiveImages
