var generateResponsiveImages = require('./lib/responsive_images')
var getNewPath = require('./lib/new_path')

hexo.extend.helper.register('image_version', function (original, options) {
  return getNewPath(original, options)
});


hexo.extend.filter.register('after_generate', generateResponsiveImages)
