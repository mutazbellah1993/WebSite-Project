<?php

namespace App\Http\Controllers;

use App\Models\ContentCategory;
use App\Models\Insight;
use App\Support\SafeHtml;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PublicInsightController extends Controller
{
    public function index(Request $request): Response
    {
        $type = (string) $request->query('type', '');
        $category = (string) $request->query('category', '');
        $locale = app()->getLocale();

        $query = Insight::query()
            ->with('categories')
            ->published();

        if (in_array($type, Insight::TYPES, true)) {
            $query->where('type', $type);
        }

        if ($category !== '') {
            $query->whereHas('categories', fn (Builder $query): Builder => $query->where('slug', $category));
        }

        $query
            ->orderByDesc('is_featured')
            ->orderByRaw('CASE WHEN published_at IS NULL THEN 1 ELSE 0 END')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        return Inertia::render('public/insights', [
            'insights' => $query
                ->paginate(9)
                ->withQueryString()
                ->through(fn (Insight $insight): array => $this->listItem($insight)),
            'categories' => $this->publicCategories(),
            'types' => Insight::TYPES,
            'filters' => [
                'type' => in_array($type, Insight::TYPES, true) ? $type : '',
                'category' => $category,
            ],
            'seo' => [
                'canonicalUrl' => $request->fullUrl(),
                'alternateUrls' => [
                    'en' => route('insights', [...$request->query(), 'locale' => 'en']),
                    'ar' => route('insights', [...$request->query(), 'locale' => 'ar']),
                ],
                'title' => $locale === 'ar' ? 'الأبحاث والرؤى' : 'Research and Insights',
                'description' => $locale === 'ar'
                    ? 'أبحاث ورؤى EliteData المنشورة في الإحصاء وتحليل البيانات وأبحاث السوق والتقييم.'
                    : 'Published EliteData research, insights, reports, and notes on statistics, analytics, market research, and evaluation.',
            ],
        ]);
    }

    public function show(Request $request, Insight $insight): Response
    {
        abort_unless($insight->isPubliclyAvailable(), 404);

        $insight->load('categories');
        $locale = app()->getLocale();
        $title = $locale === 'ar' ? $insight->title_ar : $insight->title_en;
        $description = $locale === 'ar'
            ? ($insight->seo_description_ar ?: $insight->excerpt_ar ?: '')
            : ($insight->seo_description_en ?: $insight->excerpt_en ?: '');
        $canonicalUrl = route('insights.show', $insight);

        return Inertia::render('public/insight-show', [
            'insight' => $this->detailItem($insight),
            'relatedInsights' => $this->relatedInsights($insight),
            'isPreview' => false,
            'seo' => [
                'canonicalUrl' => $canonicalUrl,
                'alternateUrls' => [
                    'en' => route('insights.show', ['insight' => $insight, 'locale' => 'en']),
                    'ar' => route('insights.show', ['insight' => $insight, 'locale' => 'ar']),
                ],
                'title' => $locale === 'ar'
                    ? ($insight->seo_title_ar ?: $insight->title_ar)
                    : ($insight->seo_title_en ?: $insight->title_en),
                'description' => $description,
                'imageUrl' => $insight->coverImageUrl(),
                'ogType' => in_array($insight->type, ['article', 'report'], true) ? 'article' : 'website',
                'publishedTime' => $insight->published_at?->toISOString(),
                'structuredData' => [
                    '@context' => 'https://schema.org',
                    '@type' => $insight->type === 'report' ? 'Report' : 'Article',
                    'headline' => $title,
                    'description' => $description,
                    'datePublished' => $insight->published_at?->toISOString(),
                    'mainEntityOfPage' => $canonicalUrl,
                    'publisher' => [
                        '@type' => 'Organization',
                        'name' => 'ELITEDATA',
                        'url' => route('home'),
                    ],
                    'image' => $insight->coverImageUrl() ? [$insight->coverImageUrl()] : null,
                ],
            ],
        ]);
    }

    public function download(Insight $insight): StreamedResponse
    {
        abort_unless($insight->isPubliclyAvailable(), 404);
        abort_unless($insight->type === 'report' && filled($insight->attachment_path), 404);
        abort_if(
            str_contains((string) $insight->attachment_path, '..')
            || ! str_starts_with((string) $insight->attachment_path, 'insights/reports/'),
            404,
        );
        abort_unless(Storage::disk('local')->exists((string) $insight->attachment_path), 404);

        return Storage::disk('local')->download(
            (string) $insight->attachment_path,
            $insight->publicDownloadName(),
            ['Content-Type' => 'application/pdf'],
        );
    }

    private function listItem(Insight $insight): array
    {
        return [
            'type' => $insight->type,
            'slug' => $insight->slug,
            'title' => [
                'en' => $insight->title_en,
                'ar' => $insight->title_ar,
            ],
            'excerpt' => [
                'en' => $insight->excerpt_en ?: '',
                'ar' => $insight->excerpt_ar ?: '',
            ],
            'categories' => $insight->categories
                ->map(fn (ContentCategory $category): array => [
                    'slug' => $category->slug,
                    'name' => [
                        'en' => $category->name_en,
                        'ar' => $category->name_ar,
                    ],
                ])
                ->all(),
            'published_at' => $insight->published_at?->toISOString(),
            'cover_image_url' => $insight->coverImageUrl(),
            'download_url' => $insight->type === 'report' && $insight->attachment_path
                ? route('insights.download', $insight)
                : null,
        ];
    }

    private function detailItem(Insight $insight): array
    {
        return [
            ...$this->listItem($insight),
            'body' => [
                'en' => SafeHtml::sanitize($insight->body_en) ?: '',
                'ar' => SafeHtml::sanitize($insight->body_ar) ?: '',
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function relatedInsights(Insight $insight): array
    {
        return Insight::query()
            ->with('categories')
            ->published()
            ->whereKeyNot($insight->id)
            ->where(function (Builder $query) use ($insight): void {
                $query->where('type', $insight->type);

                $categoryIds = $insight->categories->pluck('id')->all();

                if ($categoryIds !== []) {
                    $query->orWhereHas('categories', fn (Builder $query): Builder => $query->whereIn('content_categories.id', $categoryIds));
                }
            })
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (Insight $insight): array => $this->listItem($insight))
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function publicCategories(): array
    {
        return ContentCategory::query()
            ->whereHas('insights', fn (Builder $query): Builder => $query->published())
            ->withCount(['insights as published_insights_count' => fn (Builder $query): Builder => $query->published()])
            ->ordered()
            ->get()
            ->map(fn (ContentCategory $category): array => [
                'slug' => $category->slug,
                'name' => [
                    'en' => $category->name_en,
                    'ar' => $category->name_ar,
                ],
                'description' => [
                    'en' => $category->description_en ?: '',
                    'ar' => $category->description_ar ?: '',
                ],
                'published_insights_count' => $category->published_insights_count,
            ])
            ->all();
    }
}
