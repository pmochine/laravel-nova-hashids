# ♺ Laravel Nova Hashids Card. Convert your ids.


[![Packagist](https://img.shields.io/packagist/v/pmochine/laravel-tongue.svg)](https://packagist.org/packages/pmochine/laravel-tongue)
[![Packagist](https://poser.pugx.org/pmochine/laravel-tongue/d/total.svg)](https://packagist.org/packages/pmochine/laravel-tongue)
[![Packagist](https://img.shields.io/packagist/l/pmochine/laravel-tongue.svg)](https://packagist.org/packages/pmochine/laravel-tongue)

![Laravel Nova Hashids](img/card.png)

**If you want to decode your Hashids, you can do this directly in your dashboard.🎉**

 >***Prerequisites**: PHP >=7.1.0 and [Hashids by vinkla](https://github.com/vinkla/laravel-hashids)

## Installation in 4 Steps*

### 1: Install Laravel Hashids 💻

https://github.com/vinkla/laravel-hashids

### 2: Publish Configuration File of Hashids

```bash
  php artisan vendor:publish
```

### 3: Add this Laravel Nova Card with composer 
```bash
  composer require pmochine/laravel-nova-hashids
```

### 4: Add to Nova Dashboard
```php
protected function cards()
{
  return [
       new \Pmochine\LaravelNovaHashids\LaravelNovaHashids
    ];
}
```

## Usage
The rest should be clear for you. If not you can always open an issue.

## Security

If you discover any security related issues, please don't email me. I'm afraid 😱. avidofood@protonmail.com

## Credits

Now comes the best part! 😍

 - https://github.com/vinkla/laravel-hashids

Oh come on. You read everything?? If you liked it so far, hit the ⭐️ button to give me a 🤩 face. 
