<?php

namespace Pmochine\LaravelNovaHashids;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Http\Middleware\Authenticate;
use Laravel\Nova\Http\Middleware\Authorize;
use Laravel\Nova\Nova;
use Pmochine\LaravelNovaHashids\Contracts\Converter;

class CardServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(Converter::class, VinklaHashidsConverter::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->booted(function () {
            $this->routes();
        });

        Nova::serving(function (ServingNova $event) {
            Nova::script('laravel-nova-hashids', __DIR__.'/../dist/js/card.js');
            Nova::style('laravel-nova-hashids', __DIR__.'/../dist/css/card.css');
        });
    }

    /**
     * Register the card's routes.
     *
     * The "nova" middleware group does not authenticate the user since Nova 4.
     * The routes add Nova's own middleware, like Nova's API routes do.
     */
    protected function routes(): void
    {
        if ($this->app->routesAreCached()) {
            return;
        }

        Route::middleware(['nova', Authenticate::class, Authorize::class])
            ->prefix('nova-vendor/laravel-nova-hashids')
            ->group(__DIR__.'/../routes/api.php');
    }
}
