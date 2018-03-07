import test from 'ava'

import getSandbox from './support/sandbox'
import {process, hasHelper, getHelper} from './support/hexo_test_utils/functions'

const sandbox = getSandbox()

test('returns prefixed version of the filename', t => {
  const ctx = sandbox()

  t.plan(4)
  return process(ctx).then(() => {
    t.is(hasHelper(ctx, 'image_version'), true)

    const imageVersion = getHelper(ctx, 'image_version')

    t.is(imageVersion('my/file.jpg', {prefix: 'thumb'}), 'my/thumb_file.jpg')
    t.is(imageVersion('my/file.jpg', {prefix: 'small'}), 'my/small_file.jpg')
    t.is(imageVersion('file.jpg', {prefix: 'big'}), 'big_file.jpg')
  })
})
