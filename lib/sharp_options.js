function applyOptions(rawImage, options) {
  if (typeof options.quality === 'undefined') {
    return rawImage
  }

  var value = options.quality

  return rawImage
    .jpeg({quality: value, force: false})
    .webp({quality: value, force: false})
    .tiff({quality: value, force: false})
}

function pickResizeOptions(options) {
  const exceptKeys = ['width', 'height']
  const result = {}

  for (let key in options) {
    if (options.hasOwnProperty(key) && exceptKeys.indexOf(key) == -1) {
      result[key] = options[key]
    }
  }
  return result
}

function getResizeOptions(hexo, config) {
  // Legacy `config.options`, we accepted resize options that way
  // but now we pick them directly from the config
  var options = Object.assign(pickResizeOptions(config), config.options)

  if (config.options) {
    deprecateOption(hexo, 'options','Pass resize options next to width and height, without the options: key')
  }

  if (config.embed) {
    deprecateOption(hexo, 'embed','Use `fit: "contain"` with a `position` instead')

    options.fit = 'contain'
    if (typeof config.embed != 'boolean') {
      options.position = config.embed
    }
  }

  if (config.ignoreAspectRatio) {
    deprecateOption(hexo, 'ignoreAspectRatio', 'Use `fit: "fill"` instead')
    options.fit = 'fill'
  }

  if (config.min) {
    deprecateOption(hexo, 'min', 'Use `fit: "outside"` instead')
    options.fit = 'outside'
  }

  if (config.max) {
    deprecateOption(hexo, 'max', 'Use `fit: "inside"` instead')
    options.fit = 'inside'
  }

  if (config.crop) {
    deprecateOption(hexo, 'crop', 'Use `fit: "cover"` with a `position` instead')
    options.fit = 'cover'
    if (typeof config.crop != 'boolean') {
      options.position = config.crop
    }
  }

  return options
}

function deprecateOption(hexo, name, message) {
  hexo.log.warn('[Responsive images plugin] Deprecated option "' + name + '" found in the config. ' + message)
}

exports.applyOptions = applyOptions
exports.getResizeOptions = getResizeOptions
