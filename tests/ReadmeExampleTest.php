<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use App\Support\SqidsConverter;
use Pmochine\LaravelNovaHashids\Contracts\Converter;

/**
 * Runs the Sqids example from README.md, so the documented code stays correct.
 */
class ReadmeExampleTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists(SqidsConverter::class, false)) {
            $readme = file_get_contents(__DIR__.'/../README.md');

            $this->assertSame(1, preg_match('/```php\n(namespace App\\\\Support;.*?)```/s', $readme, $match));

            eval($match[1]);
        }

        $this->app->bind(Converter::class, SqidsConverter::class);
        $this->actingAs($this->novaUser());
    }

    public function test_the_sqids_example_converts_ids(): void
    {
        foreach (['0', '42', (string) PHP_INT_MAX] as $modelId) {
            $hashId = $this->postJson(self::ENDPOINT, ['connection' => 'sqids', 'modelId' => $modelId])
                ->assertOk()
                ->json('hashId');

            $this->postJson(self::ENDPOINT, ['connection' => 'sqids', 'hashId' => $hashId])
                ->assertOk()
                ->assertJsonPath('modelId', $modelId);
        }
    }

    public function test_the_sqids_example_rejects_ids_above_php_int_max(): void
    {
        foreach (['9223372036854775808', '18446744073709551615'] as $modelId) {
            $this->postJson(self::ENDPOINT, ['connection' => 'sqids', 'modelId' => $modelId])
                ->assertUnprocessable()
                ->assertJsonValidationErrors('modelId');
        }
    }

    public function test_the_sqids_example_rejects_a_hashid_that_sqids_does_not_create(): void
    {
        $this->postJson(self::ENDPOINT, ['connection' => 'sqids', 'hashId' => 'not-a-sqid'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('hashId');
    }
}
