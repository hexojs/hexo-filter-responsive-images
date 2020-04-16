# hexo-filter-responsive-images

[![build status](https://travis-ci.org/hexojs/hexo-filter-responsive-images.svg?branch=master)](https://travis-ci.org/hexojs/hexo-filter-responsive-images)
[![npm version](https://badge.fury.io/js/hexo-filter-responsive-images.svg)](https://www.npmjs.com/package/hexo-filter-responsive-images)

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

A [micromatch](https://github.com/micromatch/micromatch) pattern. All matching assets will use the
assigned size rules.

### Sizes

```yml
sizes:
  [name]:
    width: Number
    height: Number
    ...
```

Put a size name as a key. It will be used as a prefix for the generated file names.
Use `width` and `height` keys to configure dimensions. Skip one for auto-scale.

Everything else will be passed to the `resize` method of sharp. See the most important
options listed below.

#### Resizing options

```
fit: String
```

After sharp documentation:
- `cover`: Default value. Crops to cover both provided dimensions.
- `contain`: Embeds within both provided dimensions.
- `fill`: Ignores the aspect ratio of the input and stretch to both provided dimensions.
- `inside`: Resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
            Preserves aspect ratio.
- `outside`: Resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.
             Preserves aspect ratio.

```
position: String
```


Works for `cover` or `contain` fit setting. Should be value from either `sharp.position` or `sharp.gravity`
list, for example 'right' or 'northeast'

```
withoutEnlargement: Boolean
```


When true, do not enlarge if the width or height are already less than
the specified dimensions

```
quality: Number
```

It's a number from 0 to 100, which controls quality of the output file.
Works with jpg, webp and tiff format.

Full information about sharp API specific options can be found in the
[sharp documentation](http://sharp.pixelplumbing.com/en/stable/api-resize/)

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
      fit: inside
    large:
      width: 2000
      withoutEnlargement: true
```

## Usage

To get the responsive image URL you can just refer to it's prefixed version. 
For a programmatic usage in theme templates, you can use a view helper:

```javascript
image_version(image_path, {prefix: ''})
```

For example:

```javascript
image_version('photo.jpg', {prefix: 'small')
```

It returns `'small_photo.jpg'`

For usage in generated content you can hook into the `after_post_render` filter.

```javascript
const image_version = hexo.extend.helper.get('image_version');
hexo.extend.filter.register('after_post_render', data => {
  data.content = data.content.replace(/<img([^>]+)?>/igm, (_, attr) => {
    attr = attr.replace(/src="([^"]+)?"/, (_, src) => {
      return `src="${image_version(src, { prefix: 'thumb' })}"`;
    })
    return `<img${attr}>`;
  });
});
```

## Development

To run specs use:

```
npm test
```
