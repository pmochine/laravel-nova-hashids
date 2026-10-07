<?php

namespace Pmochine\LaravelNovaHashids\Tests;

use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;
use PHPUnit\Framework\Attributes\DataProvider;

class TranslationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Nova::$translations = [];
    }

    public function test_nova_gets_the_german_card_texts(): void
    {
        $this->app->setLocale('de');

        event(new ServingNova(request()));

        $this->assertSame('Umwandeln', Nova::$translations['Convert']);
    }

    /**
     * @return array<string, array{string}>
     */
    public static function localesWithoutCardTexts(): array
    {
        return [
            'english' => ['en'],
            'missing language' => ['fr'],
            // Without the check, this path reaches resources/lang/de/card.json.
            'path' => ['../lang/de'],
        ];
    }

    #[DataProvider('localesWithoutCardTexts')]
    public function test_nova_gets_no_card_texts_for_other_locales(string $locale): void
    {
        // setLocale() rejects "/", but getLocale() reads the config without a check.
        config(['app.locale' => $locale]);

        event(new ServingNova(request()));

        $this->assertSame([], Nova::$translations);
    }

    public function test_the_api_answers_in_german(): void
    {
        $this->app->setLocale('de');

        $this->actingAs($this->novaUser())
            ->postJson(self::ENDPOINT, ['connection' => 'main', 'hashId' => 'not-a-hashid'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['hashId' => 'Diese Hashid passt nicht zur gewählten Verbindung.']);
    }

    public function test_every_card_text_has_a_german_translation(): void
    {
        $this->assertTranslated(
            [__DIR__.'/../resources/js/components/Card.vue'],
            __DIR__.'/../resources/lang/de/card.json',
        );
    }

    public function test_every_api_message_has_a_german_translation(): void
    {
        $this->assertTranslated(
            glob(__DIR__.'/../src/{,*/}*.php', GLOB_BRACE),
            __DIR__.'/../lang/de.json',
        );
    }

    /**
     * Compare the keys of __() calls in the files with the keys of the translation file.
     *
     * @param  list<string>  $files
     */
    protected function assertTranslated(array $files, string $translationFile): void
    {
        $used = [];

        foreach ($files as $file) {
            preg_match_all("/__\\(\\s*'((?:[^'\\\\]|\\\\.)+)'/", file_get_contents($file), $matches);
            $used = [...$used, ...$matches[1]];
        }

        $translations = json_decode(file_get_contents($translationFile), true, flags: JSON_THROW_ON_ERROR);
        $used = array_values(array_unique($used));

        $this->assertNotEmpty($used);
        $this->assertEqualsCanonicalizing($used, array_keys($translations));

        foreach ($translations as $key => $text) {
            preg_match_all('/:\w+/', $key, $placeholders);

            foreach ($placeholders[0] as $placeholder) {
                $this->assertStringContainsString($placeholder, $text, "The translation of \"{$key}\" lost {$placeholder}.");
            }
        }
    }
}
