var isArray = require('util').isArray
var Promise = require('bluebird')
var createPool = require('fork-pool')
var minimatch = require('minimatch')
var streamToArray = require('stream-to-array')
var streamToArrayAsync = Promise.promisify(streamToArray)
var getNewPath = require('./new_path')
var resizeImage = require('./resize_image').resizeImage
var pool

function beforeGenerateResponsiveImages() {
  var hexo = this
  var config = hexo.config.responsive_images || []

  if (config.parallel) {
    pool = new createPool(__dirname + '/worker.js', null, null, {})
  }
}

function beforeExit() {
  if (pool) {
    return new Promise(function (resolve) {
      pool.drain(function () {
        resolve()
      })
    })
  }
}

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
      if(typeof arr[0] === 'string'){
        return arr[0];
      } else{
        return Buffer.concat(arr);
      }
    }).then(function (buffer) {
      return Promise.all(sizes.map(function (sizeSets) {
        return Promise.all(Object.keys(sizeSets).map(function (name) {
          var newPath = getNewPath(filePath, {prefix: name})
          return route.set(newPath, resizeImageFn(buffer, sizeSets[name], {parallel: config.parallel}))
        }))
      }))
    })
  })
}

function getSizesFor(filePath, rules) {
  return rules.reduce(function (sizes, rule) {
    var pattern = rule.pattern || ''

    if (minimatch(filePath, pattern)) {
      return sizes.concat(rule.sizes || [])
    }
    return sizes
  }, [])
}

function resizeImageFn(buffer, config, options) {
  var parallel = options && options.parallel

  if (!parallel) {
    return function () { return resizeImage(buffer, config) }
  }

  return function () {
    return new Promise(function (resolve, reject) {
      pool.enqueue({image_buffer: buffer, config: config}, function (err, response) {
        if (err) { return reject(err) }

        var buffer = response.stdout
        resolve(Buffer.from(buffer.data))
      });
    })
  }
}

exports.beforeExit = beforeExit
exports.beforeGenerateResponsiveImages = beforeGenerateResponsiveImages
exports.generateResponsiveImages = generateResponsiveImages
