<?php

namespace Pmochine\LaravelNovaHashids\Contracts;

interface Converter
{
    /**
     * Get the names of the connections the card can select.
     *
     * @return list<string>
     */
    public function connections(): array;

    /**
     * Get the connection the card selects first.
     */
    public function defaultConnection(): ?string;

    /**
     * Encode a model id. The id is a string of digits.
     *
     * Return null if the id can not be encoded.
     */
    public function encode(string $connection, string $modelId): ?string;

    /**
     * Decode a hashid to one model id, as a string of digits.
     *
     * Return null if the hashid is not valid for the connection.
     */
    public function decode(string $connection, string $hashId): ?string;
}
