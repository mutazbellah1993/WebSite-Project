<?php

namespace App\Http\Controllers;

use App\Models\CaseStudy;
use App\Support\SafeHtml;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        return Inertia::render('public/projects', [
            'projects' => CaseStudy::query()
                ->published()
                ->orderByDesc('is_featured')
                ->orderByDesc('completion_date')
                ->orderByDesc('published_at')
                ->get()
                ->map(fn (CaseStudy $project): array => $this->listItem($project))
                ->all(),
            'seo' => [
                'canonicalUrl' => $request->fullUrl(),
                'alternateUrls' => [
                    'en' => route('projects', ['locale' => 'en']),
                    'ar' => route('projects', ['locale' => 'ar']),
                ],
                'title' => $locale === 'ar' ? 'المشاريع التحليلية' : 'Analytical Projects',
                'description' => $locale === 'ar'
                    ? 'مشاريع تحليلية من EliteData: لوحات معلومات تفاعلية ودراسات مبنية على بيانات موثقة.'
                    : 'Analytical projects by EliteData: interactive dashboards and studies built on documented data.',
            ],
        ]);
    }

    public function show(Request $request, CaseStudy $caseStudy): Response
    {
        abort_unless($caseStudy->isPubliclyAvailable(), 404);

        $locale = app()->getLocale();
        $title = $locale === 'ar' ? $caseStudy->title_ar : $caseStudy->title_en;
        $description = $locale === 'ar'
            ? ($caseStudy->seo_description_ar ?: $caseStudy->summary_ar ?: '')
            : ($caseStudy->seo_description_en ?: $caseStudy->summary_en ?: '');
        $canonicalUrl = route('projects.show', $caseStudy);

        return Inertia::render('public/project-show', [
            'project' => $this->detailItem($caseStudy),
            'seo' => [
                'canonicalUrl' => $canonicalUrl,
                'alternateUrls' => [
                    'en' => route('projects.show', ['caseStudy' => $caseStudy, 'locale' => 'en']),
                    'ar' => route('projects.show', ['caseStudy' => $caseStudy, 'locale' => 'ar']),
                ],
                'title' => $locale === 'ar'
                    ? ($caseStudy->seo_title_ar ?: $caseStudy->title_ar)
                    : ($caseStudy->seo_title_en ?: $caseStudy->title_en),
                'description' => $description,
                'imageUrl' => $this->absoluteUrl($caseStudy->coverImageUrl()),
                'ogType' => 'article',
                'publishedTime' => $caseStudy->published_at?->toISOString(),
                'structuredData' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CreativeWork',
                    'name' => $title,
                    'description' => $description,
                    'datePublished' => $caseStudy->published_at?->toISOString(),
                    'mainEntityOfPage' => $canonicalUrl,
                    'creator' => [
                        '@type' => 'Organization',
                        'name' => 'ELITEDATA',
                        'url' => route('home'),
                    ],
                ],
            ],
        ]);
    }

    private function absoluteUrl(?string $url): ?string
    {
        if ($url === null || preg_match('#^https?://#i', $url) === 1) {
            return $url;
        }

        return rtrim((string) config('app.url'), '/').'/'.ltrim($url, '/');
    }

    private function listItem(CaseStudy $project): array
    {
        return [
            'slug' => $project->slug,
            'title' => [
                'en' => $project->title_en,
                'ar' => $project->title_ar,
            ],
            'summary' => [
                'en' => $project->summary_en ?: '',
                'ar' => $project->summary_ar ?: '',
            ],
            'cover_image_url' => $project->coverImageUrl(),
            'completion_date' => $project->completion_date?->toDateString(),
            'is_featured' => $project->is_featured,
            'has_live_url' => $project->liveUrl() !== null,
        ];
    }

    private function detailItem(CaseStudy $project): array
    {
        $section = fn (?string $en, ?string $ar): array => [
            'en' => SafeHtml::sanitize($en) ?: '',
            'ar' => SafeHtml::sanitize($ar) ?: '',
        ];

        return [
            ...$this->listItem($project),
            'live_url' => $project->liveUrl(),
            'challenge' => $section($project->challenge_en, $project->challenge_ar),
            'methodology' => $section($project->methodology_en, $project->methodology_ar),
            'solution' => $section($project->solution_en, $project->solution_ar),
            'results' => $section($project->results_en, $project->results_ar),
        ];
    }
}
