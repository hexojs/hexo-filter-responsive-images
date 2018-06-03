import test from 'ava'
import {Suite} from 'benchmark'

import getSandbox from './support/sandbox'
import {mockConfig, init} from 'hexo-test-utils'

const sandbox = getSandbox()

async function generate(options) {
  const parallel = options && options.parallel

  const ctx = await sandbox({fixtureName: 'benchmark', skipInit: true})
  mockConfig(ctx, 'responsive_images', {
    pattern: '*.jpg',
    parallel: parallel,
    sizes: {
      thumb: {width: 100},
      small: {width: 500},
      huge: {width: 1000},
    }
  })

  await init(ctx)
  return ctx.call('generate', {force: true})
}

function run(suite) {
  return new Promise(resolve => {
    suite.on('complete', () => resolve())
    suite.on('cycle', event => {
      console.log(String(event.target));
    })
    suite.run({'async': true})
  })
}

test('performance comparison', async t => {
  const suite = new Suite()

  suite.add('baseline', {
    defer: true,
    fn(deferred) {
      generate().then(() => deferred.resolve())
    }
  })

  suite.add('parallel', {
    defer: true,
    fn(deferred) {
      generate({parallel: true}).then(() => deferred.resolve())
    }
  })

  await run(suite)

  t.is(suite.filter('fastest').map('name'), ['parallel'])
})
