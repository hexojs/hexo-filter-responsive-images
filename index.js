var beforeGenerateResponsiveImages = require('./lib/responsive_images').beforeGenerateResponsiveImages
var generateResponsiveImages = require('./lib/responsive_images').generateResponsiveImages
var beforeExit = require('./lib/responsive_images').beforeExit
var getNewPath = require('./lib/new_path')

var config = hexo.config.responsive_images || {}
var priority = typeof config.priority != 'undefined' ? config.priority : 9

hexo.extend.helper.register('image_version', function (original, options) {
  return getNewPath(original, options)
});

hexo.extend.filter.register('before_generate', beforeGenerateResponsiveImages)
hexo.extend.filter.register('after_generate', generateResponsiveImages, priority)
hexo.extend.filter.register('before_exit', beforeExit)
