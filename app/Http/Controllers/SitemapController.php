<?php

namespace App\Http\Controllers;

use App\Models\Insight;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = collect([
            ['loc' => route('home'), 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => route('about'), 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => route('services'), 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => route('industries'), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => route('insights'), 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => route('request-study'), 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => route('contact'), 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => route('privacy'), 'changefreq' => 'yearly', 'priority' => '0.3'],
            ['loc' => route('terms'), 'changefreq' => 'yearly', 'priority' => '0.3'],
        ]);

        $insightUrls = Insight::query()
            ->published()
            ->orderByDesc('published_at')
            ->get(['slug', 'updated_at'])
            ->map(fn (Insight $insight): array => [
                'loc' => route('insights.show', $insight),
                'lastmod' => $insight->updated_at?->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ]);

        $xml = view('sitemap', [
            'urls' => $urls->merge($insightUrls),
        ])->render();

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
