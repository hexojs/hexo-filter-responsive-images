var sharpApiOptions = [
  createOption('withoutEnlargement', function (img, value) {
    return img.withoutEnlargement(value)
  }),
  createOption('crop', function (img, value) {
    return img.crop(value)
  }),
  createOption('embed', function (img, value) {
    if (value === true) {
      return img.embed()
    }

    return img.embed(value)
  }),
  createOption('ignoreAspectRatio', function (img, value) {
    if (!value) {
      return img
    }

    return img.ignoreAspectRatio()
  }),
  createOption('max', function (img, value) {
    if (!value) {
      return img
    }

    return img.max()
  }),
  createOption('min', function (img, value) {
    if (!value) {
      return img
    }

    return img.min()
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

exports.applyOptions = applyOptions
