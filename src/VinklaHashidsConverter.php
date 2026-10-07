<?php

namespace Pmochine\LaravelNovaHashids;

use Illuminate\Contracts\Config\Repository;
use Pmochine\LaravelNovaHashids\Contracts\Converter;
use Vinkla\Hashids\HashidsManager;

class VinklaHashidsConverter implements Converter
{
    public function __construct(
        protected HashidsManager $hashids,
        protected Repository $config,
    ) {
    }

    public function connections(): array
    {
        return array_map('strval', array_keys((array) $this->config->get('hashids.connections', [])));
    }

    public function defaultConnection(): ?string
    {
        $connections = $this->connections();
        $default = $this->config->get('hashids.default');

        return in_array($default, $connections, true) ? $default : ($connections[0] ?? null);
    }

    public function encode(string $connection, string $modelId): ?string
    {
        $hashId = $this->hashids->connection($connection)->encode($modelId);

        return $hashId === '' ? null : $hashId;
    }

    public function decode(string $connection, string $hashId): ?string
    {
        $numbers = $this->hashids->connection($connection)->decode($hashId);

        return count($numbers) === 1 ? (string) $numbers[0] : null;
    }
}
