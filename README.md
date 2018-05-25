# hexo-filter-responsive-images

![](https://travis-ci.org/hexojs/hexo-filter-responsive-images.svg?branch=master)
[![npm version](https://badge.fury.io/js/hexo-filter-responsive-images.svg)](https://badge.fury.io/js/hexo-filter-responsive-images)

Generate mutliple versions of images for responsive Hexo 3.x blogs
It uses [sharp](https://github.com/lovell/sharp) library to transform images.

Comparison to similar plugins:
 - [hexo-img-optimization](https://github.com/vkuznecovas/hexo-img-optimization) adds a separate command and doesn't work
    with `hexo server`. Requires ImageMagick to be installed. This plugin is integrated with `hexo generate` and works with `hexo server`.
 - [hexo-image-sizes](https://github.com/ottobonn/hexo-image-sizes) is very similar, but this one is optimized for
   performance for local testing by being lazy - nothing is transformed unless requested.

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

```yml
sizes:
  [name]:
    width: Number
    height: Number
    options: Object
    crop: String
    embed: Boolean|String
    ignoreAspectRatio: Boolean
    max: Boolean
    min: Boolean
    withoutEnlargement: Boolean
    quality: Number
```

Put a size name as a key. It will be used as a prefix for the generated file names.
Use `width` and `height` keys to configure dimensions. Skip one for auto-scale.

You can specify `options` that will be passed to the `resize` method.
For more information and all possible values for `options` check http://sharp.pixelplumbing.com/en/stable/api-resize/

You can specify `quality` option, a number from 0 to 100, which controls quality of the output file.
Works with jpg, webp and tiff format.

Finally, you can specify one or more sharp API specific options. You can:
 - request to use `min`, `max` or `embed` strategy for resizing
 - specify strategy or gravity for cropping with `crop` option
 - disable images enlargement by setting `withoutEnlargement` to true
 - resize to exact dimensions by setting `ignoreAspectRatio` to true

All information about sharp API specific options can be found in the [sharp documentation](http://sharp.pixelplumbing.com/en/stable/api-resize/)

### Priority

Optionally, you can put `pattern` and `sizes` configuration under `rules` key and use `priority` option to
set the priority of `after_generate` filter. Can be handy, if you want to control the order of filters executed
on your files.

```yml
priority: 9
rules: ...
```

You can find more information about priority in [Filter](https://hexo.io/api/filter.html) documentation.

### Examples

Single pattern:

```yml
responsive_images:
  pattern: '**/*.+(png|jpg|jpeg)'
  sizes:
    small:
      width: 800
    medium:
      width: 1200
    large:
      width: 2000
```

For your `photo.jpg` it will generate the following files:

```
small_photo.jpg
medium_photo.jpg
large_photo.jpg
```

You can also use multiple patterns:

```yml
responsive_images:
  - pattern: squares/*.jpg
    sizes:
      square:
        width: 200
        height: 200
        
  - pattern: '**/*.+(png|jpg|jpeg)'
    sizes:
      thumb:
        width: 900
```

And the example with priority:

```yml
responsive_images:
  priority: 9
  rules:
    - pattern: squares/*.jpg
      sizes:
        square:
          width: 200
          height: 200

    - pattern: '**/*.+(png|jpg|jpeg)'
      sizes:
        thumb:
          width: 900
```

The following example uses sharp API specific options for advanced control:

```yml
responsive_images:
  pattern: '**/*.+(png|jpg|jpeg)'
  sizes:
    small:
      width: 800
      height: 800
      max: true
    large:
      width: 2000
      withoutEnlargement: true
```

## View helper

To get the responsive image URL you can just refer to it's prefixed version. 
For a programmatic usage, you can use a view helper:

```
image_version(image_path, {prefix: ''})
```

For example:

```
image_version('photo.jpg', {prefix: 'small')
```

It returns `'small_photo.jpg'`


## Development

To run specs use:

```
npm test
```
