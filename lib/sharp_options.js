function deprecateWarning(message) {
  console.log(message)
}
var sharpApiOptions = [
  createOption('options', function (img, value) {
    deprecateWarning('Pass resize options next to width and height, without the options: key')
    return img
  }),
  createOption('crop', function (img, value) {
    deprecateWarning('Use `fit: "cover"` with a `position` instead.')
    return img
  }),
  createOption('embed', function (img, value) {
    deprecateWarning('Use `fit: "container"` with a `position` instead.')
    return img
  }),
  createOption('ignoreAspectRatio', function (img, value) {
    deprecateWarning('Use `fit: "fill"` instead.')
    return img
  }),
  createOption('max', function (img, value) {
    deprecateWarning('Use `fit: "inside"` instead.')
    return img
  }),
  createOption('min', function (img, value) {
    deprecateWarning('Use `fit: "outside"` instead.')
    return img
  }),
  createOption('quality', function (img, value) {
    if (typeof value === 'undefined') {
      return img
    }

    return img
      .jpeg({quality: value, force: false})
      .webp({quality: value, force: false})
      .tiff({quality: value, force: false})
  })
]

function createOption(name, applyFn) {
  return {
    configName: name,
    applyFn: applyFn
  }
}

function applyOptions(rawImage, options) {
  return sharpApiOptions.reduce(function (img, option) {
    var value = options[option.configName]
    if (typeof value === 'undefined') {
      return img
    }

    return option.applyFn(img, value)
  }, rawImage)
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
function getResizeOptions(config) {
  // Legacy `config.options`, we accepted resize options that way
  // but now we pick them directly from the config
  var options = Object.assign(pickResizeOptions(config), config.options)

  if (config.embed) {
    options.fit = 'contain'
    if (typeof config.embed != 'boolean') {
      options.position = config.embed
    }
  }

  if (config.ignoreAspectRatio) {
    options.fit = 'fill'
  }

  if (config.min) {
    options.fit = 'outside'
  }

  if (config.max) {
    options.fit = 'inside'
  }

  if (config.crop) {
    options.fit = 'cover'
    if (typeof config.crop != 'boolean') {
      options.position = config.crop
    }
  }

  return options
}

exports.applyOptions = applyOptions
exports.getResizeOptions = getResizeOptions
