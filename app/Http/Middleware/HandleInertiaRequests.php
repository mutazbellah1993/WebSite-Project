<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $supportedLocales = config('elitedata.locales.supported', []);
        $currentLocale = app()->getLocale();
        $locale = array_key_exists($currentLocale, $supportedLocales)
            ? $currentLocale
            : config('elitedata.locales.fallback', 'en');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'brand' => config('elitedata.brand'),
            'locale' => [
                'current' => $locale,
                'fallback' => config('elitedata.locales.fallback', 'en'),
                'direction' => $supportedLocales[$locale]['direction'] ?? 'ltr',
                'supported' => $supportedLocales,
            ],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
