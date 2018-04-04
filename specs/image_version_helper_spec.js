import test from 'ava'

import getSandbox from './support/sandbox'
import {process} from 'hexo-test-utils/core'
import {hasHelper, getHelper} from 'hexo-test-utils/helpers'

const sandbox = getSandbox()

test('returns prefixed version of the filename', async t => {
  const ctx = await sandbox()

  await process(ctx)

  t.is(hasHelper(ctx, 'image_version'), true)

  const imageVersion = getHelper(ctx, 'image_version')

  t.is(imageVersion('my/file.jpg', {prefix: 'thumb'}), 'my/thumb_file.jpg')
  t.is(imageVersion('my/file.jpg', {prefix: 'small'}), 'my/small_file.jpg')
  t.is(imageVersion('file.jpg', {prefix: 'big'}), 'big_file.jpg')
})
