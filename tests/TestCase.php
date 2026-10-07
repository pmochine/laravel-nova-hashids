<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use Illuminate\Auth\GenericUser;
use Illuminate\Contracts\Auth\Access\Gate;
use Orchestra\Testbench\TestCase as Orchestra;
use Pmochine\LaravelNovaHashids\CardServiceProvider;
use Vinkla\Hashids\HashidsServiceProvider;

abstract class TestCase extends Orchestra
{
    protected const ENDPOINT = '/nova-vendor/laravel-nova-hashids/hashids';

    protected function getPackageProviders($app): array
    {
        return [
            HashidsServiceProvider::class,
            CardServiceProvider::class,
        ];
    }

    protected function defineEnvironment($app): void
    {
        $app['config']->set('hashids', [
            'default' => 'main',
            'connections' => [
                'main' => [
                    'salt' => 'main-salt',
                    'length' => 8,
                ],
                'alternative' => [
                    'salt' => 'alternative-salt',
                    'length' => 12,
                ],
            ],
        ]);

        // Nova defines this group. It holds "web" and Nova's request setup.
        $app['router']->middlewareGroup('nova', []);

        $app[Gate::class]->define('viewNova', fn ($user) => $user->getAuthIdentifier() !== 0);
    }

    protected function novaUser(int $id = 1): GenericUser
    {
        return new GenericUser(['id' => $id, 'name' => 'Nova User']);
    }
}
