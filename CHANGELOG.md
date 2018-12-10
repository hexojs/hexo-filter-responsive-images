# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.4.1]
### Changed
- configuration file follows the new sharp API
  backward compatibility is preserved though
  a compilation warning suggests steps to upgrade config file

## [1.4.0]
### Changed
- update sharp to 0.21
- update bluebird to 3.5.3

## [1.3.0]
### Added
- `quality` option

## [1.2.0]
### Added
- support for sharp API options
  - crop
  - embed
  - ignoreAspectRatio
  - max
  - min
  - withoutEnlargement

## [1.1.0]
### Added
- `priority` configuration

## [1.0.4]
### Changed
- remove `console.log`

## [1.0.3]
### Added
- add specs
- support for root level assets

## [1.0.2]
### Changed
- decrease after_generate filter priority for better integration with other plugins

## [1.0.1]
### Changed
- renamed to `hexo-filter-responsive-images`
- optimized for `hexo server`

## [1.0.0]
### Added
- Initial version published as `hexo-responsive-images`
