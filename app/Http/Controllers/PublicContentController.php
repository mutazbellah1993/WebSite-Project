<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class PublicContentController extends Controller
{
    public function home(): Response
    {
        $hasPublishedServices = Service::query()->published()->exists();
        $hasPublishedIndustries = Industry::query()->published()->exists();

        return Inertia::render('public/home', [
            'services' => Service::query()
                ->published()
                ->where('is_featured', true)
                ->orderBy('sort_order')
                ->orderBy('title_en')
                ->get()
                ->map(fn (Service $service): array => $this->serviceItem($service))
                ->all(),
            'industries' => Industry::query()
                ->published()
                ->orderBy('sort_order')
                ->orderBy('title_en')
                ->get()
                ->map(fn (Industry $industry): array => $this->industryItem($industry))
                ->all(),
            'hasPublishedServices' => $hasPublishedServices,
            'hasPublishedIndustries' => $hasPublishedIndustries,
        ]);
    }

    public function services(): Response
    {
        $services = Service::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('title_en')
            ->get()
            ->map(fn (Service $service): array => $this->serviceItem($service))
            ->all();

        return Inertia::render('public/services', [
            'services' => $services,
            'hasPublishedServices' => $services !== [],
        ]);
    }

    public function industries(): Response
    {
        $industries = Industry::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('title_en')
            ->get()
            ->map(fn (Industry $industry): array => $this->industryItem($industry))
            ->all();

        return Inertia::render('public/industries', [
            'industries' => $industries,
            'hasPublishedIndustries' => $industries !== [],
        ]);
    }

    private function serviceItem(Service $service): array
    {
        return [
            'key' => $service->icon ?: $service->slug,
            'slug' => $service->slug,
            'title' => [
                'en' => $service->title_en,
                'ar' => $service->title_ar,
            ],
            'description' => [
                'en' => $service->short_description_en ?: $service->description_en ?: '',
                'ar' => $service->short_description_ar ?: $service->description_ar ?: '',
            ],
        ];
    }

    private function industryItem(Industry $industry): array
    {
        return [
            'slug' => $industry->slug,
            'icon' => $industry->icon,
            'title' => [
                'en' => $industry->title_en,
                'ar' => $industry->title_ar,
            ],
            'description' => [
                'en' => $industry->description_en ?: '',
                'ar' => $industry->description_ar ?: '',
            ],
        ];
    }
}
