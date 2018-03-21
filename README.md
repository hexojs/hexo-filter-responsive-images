# hexo-filter-responsive-images

![](https://travis-ci.org/hexojs/hexo-filter-responsive-images.svg?branch=master)
[![npm version](https://badge.fury.io/js/hexo-filter-responsive-images.svg)](https://badge.fury.io/js/hexo-filter-responsive-images)

Generate mutliple versions of images for responsive Hexo 3.x blogs
It users [sharp](https://github.com/lovell/sharp) library to transform images.

Comparison to similar plugins:
 - [hexo-img-optimization](https://github.com/vkuznecovas/hexo-img-optimization) adds a separate command and doesn't work
    with `hexo server`. Requires ImageMagick to be installed. This plugin is integrated with `hexo generate` and works with `hexo server`.
 - [hexo-image-sizes](https://github.com/ottobonn/hexo-image-sizes) is very similar, but is not integrated with the routing, so it can't be used
   with other plugins like https://github.com/hexojs/hexo-asset-pipeline . `hexo-filter-responsive-images` plays nicely with other
   routing based plugins and is optimized for performance for local testing by being lazy - nothing is transformed unless
   requested.

## Installation

```
npm i hexo-filter-responsive-images --save
```

## Configuration

Put all your configuration under `responsive_images` key.

### Pattern
```
patten: String
```

A [minimatch](https://github.com/isaacs/minimatch) pattern. All matching assets will use the
assigned size rules.

### Sizes

```
sizes:
  [name]:
    width: Number
    height: Number
    options: Object
```

Put a size name as a key. It will be used as a prefix for the generated file names.
Use width and height keys to configure dimensions. Skip one for auto-scale.
For more information and all possible values for `options` check http://sharp.pixelplumbing.com/en/stable/api-resize/

### Examples

Single pattern:

```
responsive_images:
  pattern: content/**/*.+(png|jpg|jpeg)
  sizes:
    small:
      width: 800
    medium:
      width: 1200
    large:
      width: 2000
```

For your `content/photo.jpg` it will generate the following files:

```
content/small_photo.jpg
content/medium_photo.jpg
content/large_photo.jpg
```

You can also use multiple patterns:

```
responsive_images:
  - pattern: content/squares/*.jpg
    sizes:
      square:
        width: 200
        height: 200
        
  - pattern: content/**/*.+(png|jpg|jpeg)
    sizes:
      thumb:
        width: 900
```

## View helper

To get the responsive image URL you can just refer to it's prefixed version. 
For a programmatic usage, you can use a view helper:

```
image_version(image_path, {prefix: ''})
```

For example:

```
image_version('content/photo.jpg', {prefix: 'small') 
```

It returns `'content/small_photo.jpg'`


## Development

To run specs use:

```
npm test
```
