<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLocales = array_keys(config('elitedata.locales.supported', []));
        $candidate = $request->route('locale') ?? $request->query('locale') ?? $request->cookie('locale');
        $locale = is_string($candidate) ? $candidate : config('elitedata.locales.default', 'en');

        if (! in_array($locale, $supportedLocales, true)) {
            $locale = config('elitedata.locales.fallback', 'en');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
