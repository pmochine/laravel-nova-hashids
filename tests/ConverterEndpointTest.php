<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use Vinkla\Hashids\Facades\Hashids;

class ConverterEndpointTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->actingAs($this->novaUser());
    }

    public function test_it_lists_the_connections_and_the_default(): void
    {
        $this->getJson(self::ENDPOINT)
            ->assertOk()
            ->assertExactJson([
                'connections' => ['main', 'alternative'],
                'default' => 'main',
            ]);
    }

    public function test_it_selects_the_first_connection_if_the_default_does_not_exist(): void
    {
        config(['hashids.default' => 'missing']);

        $this->getJson(self::ENDPOINT)
            ->assertOk()
            ->assertJsonPath('default', 'main');
    }

    public function test_it_lists_no_connections_if_the_config_has_none(): void
    {
        config(['hashids.connections' => []]);

        $this->getJson(self::ENDPOINT)
            ->assertOk()
            ->assertExactJson([
                'connections' => [],
                'default' => null,
            ]);
    }

    public function test_it_encodes_a_model_id(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => '42'])
            ->assertOk()
            ->assertExactJson([
                'hashId' => Hashids::connection('main')->encode(42),
                'modelId' => '42',
            ]);
    }

    public function test_it_encodes_a_model_id_sent_as_a_number(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => 42])
            ->assertOk()
            ->assertJsonPath('hashId', Hashids::connection('main')->encode(42))
            ->assertJsonPath('modelId', '42');
    }

    public function test_it_decodes_a_hashid(): void
    {
        $hashId = Hashids::connection('main')->encode(42);

        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => $hashId])
            ->assertOk()
            ->assertExactJson([
                'hashId' => $hashId,
                'modelId' => '42',
            ]);
    }

    public function test_it_uses_the_selected_connection(): void
    {
        $hashId = Hashids::connection('alternative')->encode(42);

        $this->postJson(self::ENDPOINT, ['connection' => 'alternative', 'hashId' => $hashId])
            ->assertOk()
            ->assertJsonPath('modelId', '42');

        $this->postJson(self::ENDPOINT, ['connection' => 'alternative', 'modelId' => '42'])
            ->assertOk()
            ->assertJsonPath('hashId', $hashId);
    }

    public function test_the_model_id_wins_if_the_request_contains_both_values(): void
    {
        $this->postJson(self::ENDPOINT, [
            'connection' => 'alternative',
            'hashId' => Hashids::connection('main')->encode(42),
            'modelId' => '42',
        ])
            ->assertOk()
            ->assertJsonPath('hashId', Hashids::connection('alternative')->encode(42));
    }

    public function test_it_keeps_large_ids_exact(): void
    {
        $modelId = '18446744073709551615';

        $hashId = $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => $modelId])
            ->assertOk()
            ->json('hashId');

        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => $hashId])
            ->assertOk()
            ->assertJsonPath('modelId', $modelId);
    }

    /**
     * @return array<string, array{float}>
     */
    public static function decimalNumbers(): array
    {
        return [
            'rounds to an integer' => [10.00000000000001],
            'decimal' => [42.5],
        ];
    }

    #[DataProvider('decimalNumbers')]
    public function test_it_rejects_a_model_id_sent_as_a_decimal_number(float $modelId): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => $modelId])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['modelId' => 'The model id must be a positive whole number.']);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function modelIdsWithLeadingZeros(): array
    {
        return [
            'octal digits' => ['00042', '42'],
            'not octal' => ['08', '8'],
            'zero' => ['0', '0'],
            'only zeros' => ['000', '0'],
        ];
    }

    #[DataProvider('modelIdsWithLeadingZeros')]
    public function test_it_removes_leading_zeros_from_the_model_id(string $input, string $modelId): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => $input])
            ->assertOk()
            ->assertExactJson([
                'hashId' => Hashids::connection('main')->encode((int) $modelId),
                'modelId' => $modelId,
            ]);
    }

    public function test_it_decodes_a_long_hashid(): void
    {
        config(['hashids.connections.long' => ['salt' => 'long-salt', 'length' => 256]]);

        $hashId = $this->postJson(self::ENDPOINT, ['connection' => 'long', 'modelId' => '42'])
            ->assertOk()
            ->json('hashId');

        $this->assertSame(256, strlen($hashId));

        $this->postJson(self::ENDPOINT, ['connection' => 'long', 'hashId' => $hashId])
            ->assertOk()
            ->assertJsonPath('modelId', '42');
    }

    public function test_it_rejects_a_hashid_with_more_than_1000_characters(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => str_repeat('a', 1001)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('hashId');
    }

    public function test_it_leaves_out_connections_that_the_hashids_manager_can_not_select(): void
    {
        config(['hashids.connections' => config('hashids.connections') + [
            '0' => ['salt' => 'zero-salt', 'length' => 8],
            '' => ['salt' => 'empty-salt', 'length' => 8],
        ]]);

        $this->getJson(self::ENDPOINT)
            ->assertOk()
            ->assertJsonPath('connections', ['main', 'alternative']);

        $this->postJson(self::ENDPOINT, ['connection' => '0', 'modelId' => '42'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('connection');

        $this->postJson(self::ENDPOINT, ['connection' => '', 'modelId' => '42'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('connection');
    }

    public function test_it_rejects_a_hashid_that_is_not_valid(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => 'not-a-hashid'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['hashId' => 'This hashid is not valid for the selected connection.']);
    }

    public function test_it_rejects_a_hashid_of_an_other_connection(): void
    {
        $hashId = Hashids::connection('alternative')->encode(42);

        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => $hashId])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('hashId');
    }

    public function test_it_rejects_a_hashid_that_holds_more_than_one_number(): void
    {
        $hashId = Hashids::connection('main')->encode(1, 2);

        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => $hashId])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('hashId');
    }

    public function test_it_rejects_an_unknown_connection(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'missing', 'modelId' => '42'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('connection');
    }

    public function test_it_rejects_a_config_path_as_the_connection(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main.salt', 'modelId' => '42'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('connection');
    }

    public function test_it_requires_a_hashid_or_a_model_id(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => '', 'modelId' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['modelId' => 'Enter a hashid or a model id.']);
    }

    /**
     * @return array<string, array{mixed}>
     */
    public static function invalidModelIds(): array
    {
        return [
            'negative' => ['-1'],
            'decimal' => ['1.5'],
            'letters' => ['abc'],
            'too long' => [str_repeat('9', 21)],
        ];
    }

    #[DataProvider('invalidModelIds')]
    public function test_it_rejects_a_model_id_that_is_not_a_whole_number(mixed $modelId): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'main', 'modelId' => $modelId])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('modelId');
    }
}
