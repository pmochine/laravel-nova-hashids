<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;
use Pmochine\LaravelNovaHashids\LaravelNovaHashids;

class CardTest extends TestCase
{
    public function test_the_card_uses_the_registered_vue_component(): void
    {
        $this->assertSame(
            ['component' => 'laravel-nova-hashids', 'width' => '1/3'],
            (new LaravelNovaHashids)->jsonSerialize(),
        );
    }

    public function test_nova_loads_the_compiled_assets(): void
    {
        Nova::$scripts = [];
        Nova::$styles = [];

        event(new ServingNova(request()));

        $this->assertArrayHasKey('laravel-nova-hashids', Nova::$scripts);
        $this->assertArrayHasKey('laravel-nova-hashids', Nova::$styles);
        $this->assertFileExists(Nova::$scripts['laravel-nova-hashids']);
        $this->assertFileExists(Nova::$styles['laravel-nova-hashids']);
    }
}
