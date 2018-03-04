var sharp = require('sharp')

function generateImages(buffer, sizes) {
  return Promise.all(sizes.map(function (sizeSet) {
    return generateImagesForSet(buffer, sizeSet)
  })).then(function (output) {
    return output.reduce(function (acc, results) {
      return acc.concat(results)
    }, [])
  })
}

function generateImagesForSet(buffer, sizes) {
  return Promise.all(Object.keys(sizes).map(function (name) {
    var size = sizes[name]

    return sharp(buffer).resize(size.width, size.height, size.options).toBuffer().then(function (output) {
      return {output: output, name: name}
    })
  }))
}

module.exports = generateImages
