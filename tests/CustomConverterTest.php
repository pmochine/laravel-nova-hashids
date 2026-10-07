<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use Pmochine\LaravelNovaHashids\Contracts\Converter;

class CustomConverterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app->bind(Converter::class, fn () => new class implements Converter
        {
            public function connections(): array
            {
                return ['reverse'];
            }

            public function defaultConnection(): ?string
            {
                return 'reverse';
            }

            public function encode(string $connection, string $modelId): ?string
            {
                return strlen($modelId) > 5 ? null : 'id-'.strrev($modelId);
            }

            public function decode(string $connection, string $hashId): ?string
            {
                return str_starts_with($hashId, 'id-') ? strrev(substr($hashId, 3)) : null;
            }
        });

        $this->actingAs($this->novaUser());
    }

    public function test_the_card_uses_a_custom_converter(): void
    {
        $this->getJson(self::ENDPOINT)
            ->assertOk()
            ->assertExactJson(['connections' => ['reverse'], 'default' => 'reverse']);

        $this->postJson(self::ENDPOINT, ['connection' => 'reverse', 'modelId' => '123'])
            ->assertOk()
            ->assertExactJson(['hashId' => 'id-321', 'modelId' => '123']);

        $this->postJson(self::ENDPOINT, ['connection' => 'reverse', 'hashId' => 'id-321'])
            ->assertOk()
            ->assertExactJson(['hashId' => 'id-321', 'modelId' => '123']);
    }

    public function test_the_card_shows_an_error_if_the_converter_can_not_encode_the_id(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'reverse', 'modelId' => '123456'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['modelId' => 'The selected connection can not encode this model id.']);
    }

    public function test_the_card_shows_an_error_if_the_converter_can_not_decode_the_hashid(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'reverse', 'hashId' => 'other-321'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['hashId' => 'This hashid is not valid for the selected connection.']);
    }

    public function test_the_card_rejects_a_connection_of_the_default_converter(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => '123'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('connection');
    }
}
