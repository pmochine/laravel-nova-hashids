<?php

/*
|--------------------------------------------------------------------------
| Laravel Nova stubs
|--------------------------------------------------------------------------
|
| Laravel Nova is a paid package. Composer can not install it in CI.
| These stubs copy the small part of the Nova 5 API that this package
| uses. The middleware stubs act like Nova's middleware: Authenticate
| rejects guests and Authorize checks the "viewNova" gate.
|
*/

namespace Laravel\Nova {
    use Illuminate\Support\Facades\Event;
    use JsonSerializable;
    use Laravel\Nova\Events\ServingNova;

    class Nova
    {
        /** @var array<string, string> */
        public static array $scripts = [];

        /** @var array<string, string> */
        public static array $styles = [];

        public static function serving($callback): void
        {
            Event::listen(ServingNova::class, $callback);
        }

        public static function script($name, $path): void
        {
            static::$scripts[$name] = $path;
        }

        public static function style($name, $path): void
        {
            static::$styles[$name] = $path;
        }
    }

    abstract class Card implements JsonSerializable
    {
        public $width = '1/3';

        abstract public function component();

        public function jsonSerialize(): array
        {
            return [
                'component' => $this->component(),
                'width' => $this->width,
            ];
        }
    }
}

namespace Laravel\Nova\Events {
    class ServingNova
    {
        public function __construct(public $request = null)
        {
        }
    }
}

namespace Laravel\Nova\Http\Middleware {
    use Closure;
    use Illuminate\Auth\AuthenticationException;
    use Illuminate\Support\Facades\Gate;

    class Authenticate
    {
        public function handle($request, Closure $next)
        {
            if (! $request->user()) {
                throw new AuthenticationException();
            }

            return $next($request);
        }
    }

    class Authorize
    {
        public function handle($request, Closure $next)
        {
            return Gate::check('viewNova', [$request->user()]) ? $next($request) : abort(403);
        }
    }
}
