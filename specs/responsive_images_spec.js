import test from 'ava'
import sharp from 'sharp'

import getSandbox from './support/sandbox'
import {process, mockConfig} from 'hexo-test-utils/core'
import {hasRoute, contentFor} from 'hexo-test-utils/routing'

const sandbox = getSandbox()

function getImageDimensions(buffer) {
  return sharp(buffer).metadata().then(({width, height}) => {
    return {width, height}
  })
}

test('renders prefixed asset', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100},
      small: {width: 500},
      huge: {width: 1000},
    }
  })

  await process(ctx)

  t.is(hasRoute(ctx, 'thumb_image.png'), true)
  t.is(hasRoute(ctx, 'small_image.png'), true)
  t.is(hasRoute(ctx, 'huge_image.png'), true)
})

test('renders resized asset', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100}
    }
  })

  await process(ctx)
  const buffer = await contentFor(ctx, 'thumb_image.png')
  const {width, height} = await getImageDimensions(buffer)
  t.is(width, 100)
  t.is(height, 100)
})

test('upscales resized asset', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 1000}
    }
  })

  await process(ctx)
  const buffer = await contentFor(ctx, 'thumb_image.png')
  const {width, height} = await getImageDimensions(buffer)
  t.is(width, 1000)
  t.is(height, 1000)
})

test('renders resized asset by pattern', async t => {
  const ctx = await sandbox('test2')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*_1.png',
    sizes: {
      thumb: {width: 100}
    }
  })

  await process(ctx)
  t.is(hasRoute(ctx, 'image_1.png'), true)
  t.is(hasRoute(ctx, 'thumb_image_1.png'), true)
  t.is(hasRoute(ctx, 'image_2.png'), true)
  t.is(hasRoute(ctx, 'thumb_image_2.png'), false)
})

test('renders resized assets using array of rules', async t => {
  const ctx = await sandbox('test2')

  mockConfig(ctx, 'responsive_images', [
    {
      pattern: '*_1.png',
      sizes: {
        super_small: {width: 10}
      }
    },
    {
      pattern: '*.png',
      sizes: {
        thumb: {width: 100}
      }
    }
  ])

  await process(ctx)
  t.is(hasRoute(ctx, 'image_1.png'), true)
  t.is(hasRoute(ctx, 'thumb_image_1.png'), true)
  t.is(hasRoute(ctx, 'super_small_image_1.png'), true)
  t.is(hasRoute(ctx, 'image_2.png'), true)
  t.is(hasRoute(ctx, 'thumb_image_2.png'), true)
  t.is(hasRoute(ctx, 'super_small_image_2.png'), false)
})

test('uses the priority from the configuration when it is higher', async t => {
  const ctx = await sandbox('test2')

  ctx.extend.filter.register('after_generate', () => {
    ctx.route.remove('image_2.png')
  }, 10)

  mockConfig(ctx, 'responsive_images', {
    priority: 11,
    rules: [
      {
        pattern: '*.png',
        sizes: {
          super_small: {width: 10}
        }
      }
    ]
  })

  await process(ctx)

  t.is(hasRoute(ctx, 'image_1.png'), true)
  t.is(hasRoute(ctx, 'super_small_image_1.png'), true)
  t.is(hasRoute(ctx, 'image_2.png'), false)
  t.is(hasRoute(ctx, 'super_small_image_2.png'), false)
})

test('uses the priority from the configuration when it is lower', async t => {
  const ctx = await sandbox('test2')

  ctx.extend.filter.register('after_generate', () => {
    ctx.route.remove('image_2.png')
  }, 10)

  mockConfig(ctx, 'responsive_images', {
    priority: 9,
    rules: [
      {
        pattern: '*.png',
        sizes: {
          super_small: {width: 10}
        }
      }
    ]
  })

  await process(ctx)

  t.is(hasRoute(ctx, 'image_1.png'), true)
  t.is(hasRoute(ctx, 'super_small_image_1.png'), true)
  t.is(hasRoute(ctx, 'image_2.png'), false)
  t.is(hasRoute(ctx, 'super_small_image_2.png'), true)
})

test('uses the priority from the configuration when it is default', async t => {
  const ctx = await sandbox('test2')

  ctx.extend.filter.register('after_generate', () => {
    ctx.route.remove('image_2.png')
  }, 10)

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      super_small: {width: 10}
    }
  })

  await process(ctx)

  t.is(hasRoute(ctx, 'image_1.png'), true)
  t.is(hasRoute(ctx, 'super_small_image_1.png'), true)
  t.is(hasRoute(ctx, 'image_2.png'), false)
  t.is(hasRoute(ctx, 'super_small_image_2.png'), true)
})

test('handles withoutEnlargement', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 1000, withoutEnlargement: true}
    }
  })

  await process(ctx)
  const buffer = await contentFor(ctx, 'thumb_image.png')
  const {width, height} = await getImageDimensions(buffer)
  t.is(width, 600)
  t.is(height, 600)
})

test('handles embed', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100, height: 50, embed: true}
    }
  })

  await process(ctx)
  const buffer = await contentFor(ctx, 'thumb_image.png')
  t.snapshot(buffer.toString())
})

test('handles min', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100, height: 50, min: true}
    }
  })

  await process(ctx)
  const buffer = await contentFor(ctx, 'thumb_image.png')
  const {width, height} = await getImageDimensions(buffer)
  t.is(width, 100)
  t.is(height, 100)
})

test('handles max', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100, height: 50, max: true}
    }
  })

  await process(ctx)
  const buffer = await contentFor(ctx, 'thumb_image.png')
  const {width, height} = await getImageDimensions(buffer)
  t.is(width, 50)
  t.is(height, 50)
})

test('handles ignoreAspectRatio', async t => {
  const ctx = await sandbox('test1')

  mockConfig(ctx, 'responsive_images', {
    pattern: '*.png',
    sizes: {
      thumb: {width: 100, height: 50, ignoreAspectRatio: true}
    }
  })

  await process(ctx)
  const buffer = await contentFor(ctx, 'thumb_image.png')
  t.snapshot(buffer.toString())
})
