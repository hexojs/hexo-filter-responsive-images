var generateResponsiveImages = require('./lib/responsive_images')
var getNewPath = require('./lib/new_path')

var config = hexo.config.responsive_images || {}
var priority = typeof config.priority != 'undefined' ? config.priority : 9

hexo.extend.helper.register('image_version', function (original, options) {
  return getNewPath(original, options)
});

hexo.extend.filter.register('after_generate', generateResponsiveImages, priority)
