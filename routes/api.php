<?php

use Illuminate\Support\Facades\Route;
use Pmochine\LaravelNovaHashids\Http\HashidsConverterController;

/*
|--------------------------------------------------------------------------
| Card API Routes
|--------------------------------------------------------------------------
|
| The CardServiceProvider loads these routes. They use the prefix
| "nova-vendor/laravel-nova-hashids" and Nova's authentication and
| authorization middleware.
|
*/

Route::get('hashids', [HashidsConverterController::class, 'index']);

Route::post('hashids', [HashidsConverterController::class, 'convert']);
