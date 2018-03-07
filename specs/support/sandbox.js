const {createHexoSandbox} = require('./hexo_test_utils')
const path = require('path')

module.exports = function getSandbox() {
  return  createHexoSandbox({
    fixture_folder: path.join(__dirname, '..','fixtures'),
    plugins: [
      path.join(__dirname, '..', '..','index.js')
    ]
  })
}
