<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use Illuminate\Support\Facades\Route;
use Laravel\Nova\Http\Middleware\Authenticate;
use Laravel\Nova\Http\Middleware\Authorize;

class AuthorizationTest extends TestCase
{
    public function test_the_routes_use_nova_authentication_and_authorization(): void
    {
        $routes = collect(Route::getRoutes()->getRoutes())
            ->filter(fn ($route) => $route->uri() === 'nova-vendor/laravel-nova-hashids/hashids');

        $this->assertCount(2, $routes);

        foreach ($routes as $route) {
            $this->assertSame(['nova', Authenticate::class, Authorize::class], $route->gatherMiddleware());
        }
    }

    public function test_a_guest_can_not_use_the_endpoint(): void
    {
        $this->getJson(self::ENDPOINT)->assertUnauthorized();

        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => '42'])->assertUnauthorized();
    }

    public function test_a_user_without_nova_access_can_not_use_the_endpoint(): void
    {
        $this->actingAs($this->novaUser(0));

        $this->getJson(self::ENDPOINT)->assertForbidden();

        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => '42'])->assertForbidden();
    }
}
