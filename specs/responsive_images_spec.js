import test from 'ava'
import path from 'path'

import {createHexoSandbox} from './support/hexo_test_utils'
import {mockConfig, process, hasRoute} from './support/hexo_test_utils/functions'

const sandbox = createHexoSandbox({
  fixture_folder: path.join(__dirname, 'fixtures'),
  plugins: [
    path.join(__dirname, '..', 'index.js')
  ]
})

test('renders prefixed asset', t => {
  const ctx = sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100}
    }
  })

  t.plan(1)
  return process(ctx).then(ctx => {
    t.is(hasRoute(ctx, 'thumb_image.png'), true)
  })
});
