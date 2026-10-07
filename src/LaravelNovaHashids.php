<?php

namespace Pmochine\LaravelNovaHashids;

use Laravel\Nova\Card;

class LaravelNovaHashids extends Card
{
    /**
     * The width of the card (1/3, 1/2, or full).
     *
     * @var string
     */
    public $width = '1/3';

    /**
     * Get the component name for the element.
     *
     * @return string
     */
    public function component()
    {
        return 'laravel-nova-hashids';
    }

    /**
     * Select this connection when the card loads, instead of the default connection.
     *
     * @return $this
     */
    public function connection(string $name)
    {
        return $this->withMeta(['connection' => $name]);
    }
}
