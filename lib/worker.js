var resizeImage = require('./resize_image').resizeImage

process.on('message', function (message) {
  var imageJSON = message.image_buffer
  var image = Buffer.from(imageJSON.data)
  var config = message.config

  resizeImage(image, config).then(function (buffer) {
    process.send(buffer)
  })
});
