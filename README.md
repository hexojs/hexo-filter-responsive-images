# hexo-responsive-images

Generate mutliple versions of images for responsive Hexo blogs

Similar to [hexo-img-optimization](https://github.com/vkuznecovas/hexo-img-optimization), but is
integrated with `hexo generate` and works also with `hexo server`.

It depends on [sharp](https://github.com/lovell/sharp), so doesn't require ImageMagick to be installed.

## Installation

```
npm i hexo-responsive-images --save
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
