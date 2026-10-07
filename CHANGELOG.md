# Changelog

All notable changes to this package are in this file. The package follows [Semantic Versioning](https://semver.org).

## [Unreleased]

## [3.0.0] - Unreleased

Version 3 is a rebuild for Laravel Nova 5. It drops old versions of Nova, Laravel and PHP. Read the upgrade notes below before you update.

### Breaking changes

- The package requires Laravel Nova 5, Laravel 12 or 13, PHP 8.2 or newer and `vinkla/hashids` 13 or 14.
- Composer does not install version 3 next to Nova 3 or Nova 4.
- The card API changed. The request field `selected` is now `connection`. The responses use new fields. Only the card uses this API.

### Security

- The card routes now use Nova's `Authenticate` and `Authorize` middleware. Since Nova 4, the `nova` middleware group does not authenticate users. With version 2 on Nova 4 or 5, a guest was able to list the connections and encode or decode ids.

### Added

- You can use your own hash algorithm. Bind a class that implements `Pmochine\LaravelNovaHashids\Contracts\Converter`. ([#1](https://github.com/pmochine/laravel-nova-hashids/issues/1))
- The card shows an error message under the fields. The fields stay usable after an error.
- You can press Enter to convert.
- The `connection()` method sets the first connection of the card. If the connection does not exist, the card shows a warning.
- On a resource detail page, the card converts the id of the resource at the start.
- The Copy hashid button copies the hashid to the clipboard.
- German translations for the card and the API messages.

### Fixed

- The controller no longer calls `array_has()`. Laravel 6 removed this helper. ([#2](https://github.com/pmochine/laravel-nova-hashids/issues/2))
- A hashid that is not valid no longer causes a server error (HTTP 500). The card shows a message.
- A hashid that holds more than one number is rejected. The card converts single model ids only.
- The connection select shows the default connection. Before, it showed the first connection but used the default one.
- The API accepts only the names of configured connections. Before, a name with a dot, for example `main.salt`, passed the check and caused a server error.
- Large model ids keep all digits. The card sends ids as strings.
- Leading zeros in a model id no longer change the result. Before, the GMP extension read `042` as an octal number.
- The card does not show a connection with the name `0`. The Hashids manager uses the default connection for this name.
- A connection with a wrong configuration no longer causes a server error. On a server error, `Nova.request()` leaves the page. The card now shows a message, and Laravel reports the exception.

### Changed

- The card is a Vue 3 component. Nova 5 builds it with Laravel Mix 6 and `laravel/nova-devtool`.
- The package has PHPUnit tests, Vitest tests and a GitHub Actions workflow.

### Removed

- The Vue 2 components and the Sass file.

### Upgrade from version 2

1. Update your application to Laravel 12 or 13 and Laravel Nova 5.
2. Update the package:

   ```bash
   composer require pmochine/laravel-nova-hashids:^3.0
   ```

3. If you added an `array_has()` helper for issue #2, you can remove it.
4. If you cache your routes, run `php artisan route:cache` again.
5. Only users who can open Nova can use the card. Nova checks the `viewNova` gate.

## [2.3.0] - 2020-11-10

- Support for Laravel 8.

## [2.2.0] - 2020-03-19

- Support for Laravel 7.

## [2.1.0] - 2019-09-22

- Support for Laravel 6 and `vinkla/hashids` 7.

## [2.0.2] - 2019-04-06

- Fix for Packagist.

## [2.0.0] - 2019-04-06

- Support for the new version of `vinkla/hashids`. Requires PHP 7.

## [1.0.1] - 2018-12-03

- Compiled assets for production.

## [1.0.0] - 2018-12-01

- First release. Convert hashids to model ids.

[Unreleased]: https://github.com/pmochine/laravel-nova-hashids/compare/2.3.0...HEAD
[3.0.0]: https://github.com/pmochine/laravel-nova-hashids/compare/2.3.0...3.0.0
[2.3.0]: https://github.com/pmochine/laravel-nova-hashids/compare/2.2.0...2.3.0
[2.2.0]: https://github.com/pmochine/laravel-nova-hashids/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/pmochine/laravel-nova-hashids/compare/2.0.2...2.1.0
[2.0.2]: https://github.com/pmochine/laravel-nova-hashids/compare/2.0.0...2.0.2
[2.0.0]: https://github.com/pmochine/laravel-nova-hashids/compare/1.0.1...2.0.0
[1.0.1]: https://github.com/pmochine/laravel-nova-hashids/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/pmochine/laravel-nova-hashids/releases/tag/1.0.0
