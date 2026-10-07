# ♺ Laravel Nova Hashids Card. Convert your ids.

This card for [Laravel Nova](https://nova.laravel.com) converts ids on your dashboard. Enter a model id to get its hashid. Enter a hashid to get its model id. The card uses the connections of [Laravel Hashids](https://github.com/vinkla/laravel-hashids).

[![Latest Stable Version](https://poser.pugx.org/pmochine/laravel-nova-hashids/v/stable)](https://packagist.org/packages/pmochine/laravel-nova-hashids)
[![Total Downloads](https://poser.pugx.org/pmochine/laravel-nova-hashids/downloads)](https://packagist.org/packages/pmochine/laravel-nova-hashids)
[![License](https://poser.pugx.org/pmochine/laravel-nova-hashids/license)](https://packagist.org/packages/pmochine/laravel-nova-hashids)
[![Tests](https://github.com/pmochine/laravel-nova-hashids/actions/workflows/tests.yml/badge.svg)](https://github.com/pmochine/laravel-nova-hashids/actions/workflows/tests.yml)

![Laravel Nova Hashids](https://github.com/pmochine/laravel-nova-hashids/blob/master/img/card.png?raw=true)

## Requirements

| Package | Version |
| --- | --- |
| PHP | 8.2 or newer. Laravel 13 needs PHP 8.3 or newer. |
| Laravel | 12 or 13 |
| Laravel Nova | 5 |
| vinkla/hashids | 13 for Laravel 12, 14 for Laravel 13 |

Hashids needs the PHP extension `bcmath` or `gmp`.

Version 2 of this package is for Nova 3 and Laravel 6 to 8. Version 2 gets no more updates. To install it, run `composer require pmochine/laravel-nova-hashids:^2.3`.

## Installation

1. Install the package with Composer. Composer also installs `vinkla/hashids`.

   ```bash
   composer require pmochine/laravel-nova-hashids
   ```

2. Publish the Hashids configuration.

   ```bash
   php artisan vendor:publish --provider="Vinkla\Hashids\HashidsServiceProvider"
   ```

3. Set your connections in `config/hashids.php`. Each connection has a salt, a length and an optional alphabet. For details, read the [Laravel Hashids documentation](https://github.com/vinkla/laravel-hashids). Do not use the connection name `0`. The Hashids manager uses the default connection for this name, so the card does not show it.

4. Add the card to a dashboard, for example in `app/Nova/Dashboards/Main.php`.

   ```php
   use Pmochine\LaravelNovaHashids\LaravelNovaHashids;

   public function cards(): array
   {
       return [
           new LaravelNovaHashids,
       ];
   }
   ```

## Usage

1. If you have two or more connections, select a connection at the top of the card.
2. Enter a hashid or a model id.
3. Press Enter or click Convert.

The card shows the other value. If the hashid is not valid for the connection, the card shows an error. If you select a different connection after a conversion, the card converts the model id again.

### Select a connection for the card

Many applications use one Hashids connection for each model. Call `connection()` to set the first connection of the card. You can still select a different connection in the card.

```php
(new LaravelNovaHashids)->connection('users'),
```

If the connection does not exist in `config/hashids.php`, the card shows a warning and selects the default connection.

### Show the hashid of a resource

You can add the card to the detail page of a Nova resource. On a detail page, the card converts the id of the resource at the start. Nova gives the id to the card. The card converts only ids that are whole numbers.

```php
use Laravel\Nova\Http\Requests\NovaRequest;
use Pmochine\LaravelNovaHashids\LaravelNovaHashids;

public function cards(NovaRequest $request): array
{
    return [
        (new LaravelNovaHashids)->connection('users')->onlyOnDetail(),
    ];
}
```

## Access

The card routes use Nova's `Authenticate` and `Authorize` middleware. Every user who can open Nova can use the converter. Nova checks this with the `viewNova` gate.

The `canSee()` method of a card hides the card. It does not protect the card routes.

## Use your own hash algorithm

The card uses `vinkla/hashids` by default. To use a different algorithm, write a class that implements `Pmochine\LaravelNovaHashids\Contracts\Converter`. Then bind it in the `register` method of a service provider.

```php
use App\Support\SqidsConverter;
use Pmochine\LaravelNovaHashids\Contracts\Converter;

public function register(): void
{
    $this->app->bind(Converter::class, SqidsConverter::class);
}
```

The contract has four methods. Model ids are strings of digits without leading zeros, so large ids keep all digits. The card accepts model ids with up to 20 digits and hashids with up to 1000 characters.

| Method | Returns |
| --- | --- |
| `connections()` | The connection names for the select. |
| `defaultConnection()` | The connection that the card selects first. |
| `encode($connection, $modelId)` | The hashid. Return `null` for an id that the algorithm can not encode. |
| `decode($connection, $hashId)` | One model id. Return `null` for a hashid that is not valid. |

This example uses [Sqids](https://sqids.org/php), the successor of Hashids. Install Sqids first.

```bash
composer require sqids/sqids
```

```php
namespace App\Support;

use Pmochine\LaravelNovaHashids\Contracts\Converter;
use Sqids\Sqids;

class SqidsConverter implements Converter
{
    public function __construct(protected Sqids $sqids = new Sqids(minLength: 8))
    {
    }

    public function connections(): array
    {
        return ['sqids'];
    }

    public function defaultConnection(): ?string
    {
        return 'sqids';
    }

    public function encode(string $connection, string $modelId): ?string
    {
        // Sqids encodes PHP integers. This check rejects ids above PHP_INT_MAX.
        $id = filter_var($modelId, FILTER_VALIDATE_INT);

        return $id === false ? null : $this->sqids->encode([$id]);
    }

    public function decode(string $connection, string $hashId): ?string
    {
        $numbers = $this->sqids->decode($hashId);

        // Sqids decodes some ids that it never creates. Encode again to reject them.
        if (count($numbers) !== 1 || $this->sqids->encode($numbers) !== $hashId) {
            return null;
        }

        return (string) $numbers[0];
    }
}
```

## Upgrade from version 2

Version 3 needs Nova 5, Laravel 12 or 13 and PHP 8.2. For all changes and the upgrade steps, read the [changelog](CHANGELOG.md).

## Development

The PHP tests use stubs for Nova, because Composer can install Nova only with a license. The card tests use Vitest. The build needs Node.js 24.

```bash
composer install
vendor/bin/phpunit

npm ci
npm test
npm run prod
```

Commit the `dist` folder after each change to the card. Nova loads the card from `dist`. If `dist` does not match the sources, the CI workflow fails.

## Security

If you discover any security related issues, please do not email me. I'm afraid 😱. avidofood@protonmail.com

## Credits

Now comes the best part! 😍

 - https://github.com/vinkla/laravel-hashids

Oh come on. You read everything?? If you liked it so far, hit the ⭐️ button to give me a 🤩 face.
