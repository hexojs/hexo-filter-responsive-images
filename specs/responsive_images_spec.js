import test from 'ava'
import sharp from 'sharp'

import getSandbox from './support/sandbox'
import {mockConfig, process, hasRoute, contentFor} from './support/hexo_test_utils/functions'

const sandbox = getSandbox()

function getImageDimensions(buffer) {
  return sharp(buffer).metadata().then(({width, height}) => {
    return {width, height}
  })
}

test('renders prefixed asset', t => {
  const ctx = sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100},
      small: {width: 500},
      huge: {width: 1000},
    }
  })

  t.plan(3)
  return process(ctx)
    .then(ctx => {
      t.is(hasRoute(ctx, 'thumb_image.png'), true)
      t.is(hasRoute(ctx, 'small_image.png'), true)
      t.is(hasRoute(ctx, 'huge_image.png'), true)
    })
})

test('renders resized asset', t => {
  const ctx = sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100}
    }
  })

  t.plan(2)
  return process(ctx)
    .then(ctx => contentFor(ctx, 'thumb_image.png'))
    .then(buffer => getImageDimensions(buffer))
    .then(({width, height}) => {
      t.is(width, 100)
      t.is(height, 100)
    })
})


