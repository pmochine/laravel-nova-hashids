<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use Illuminate\Support\ServiceProvider;
use Pmochine\LaravelNovaHashids\Contracts\Converter;
use Pmochine\LaravelNovaHashids\VinklaHashidsConverter;

class AppProviderBindingTest extends TestCase
{
    protected function getPackageProviders($app): array
    {
        // Laravel registers the application providers after the package providers.
        return [...parent::getPackageProviders($app), AppConverterServiceProvider::class];
    }

    public function test_a_binding_in_an_application_provider_replaces_the_default_converter(): void
    {
        $this->assertInstanceOf(UppercaseConverter::class, $this->app->make(Converter::class));

        $this->actingAs($this->novaUser())
            ->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => '42'])
            ->assertOk()
            ->assertJsonPath('hashId', strtoupper(app(VinklaHashidsConverter::class)->encode('main', '42')));
    }
}

class AppConverterServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(Converter::class, UppercaseConverter::class);
    }
}

class UppercaseConverter extends VinklaHashidsConverter
{
    public function encode(string $connection, string $modelId): ?string
    {
        return strtoupper((string) parent::encode($connection, $modelId));
    }
}
