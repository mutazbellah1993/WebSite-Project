<?php

namespace Tests\Feature;

use App\Models\Industry;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_services_page_shows_published_services_only(): void
    {
        $published = $this->createService([
            'title_en' => 'Published Service',
            'title_ar' => 'خدمة منشورة',
            'slug' => 'published-service',
            'status' => 'published',
            'sort_order' => 20,
        ]);
        $this->createService(['slug' => 'draft-service', 'status' => 'draft']);
        $this->createService(['slug' => 'archived-service', 'status' => 'archived']);
        $deleted = $this->createService(['slug' => 'deleted-service', 'status' => 'published']);
        $deleted->delete();

        $this->get(route('services'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/services')
                ->where('hasPublishedServices', true)
                ->has('services', 1)
                ->where('services.0.slug', $published->slug)
                ->where('services.0.title.en', 'Published Service')
                ->where('services.0.title.ar', 'خدمة منشورة'));
    }

    public function test_industries_page_shows_published_industries_only(): void
    {
        $published = $this->createIndustry([
            'title_en' => 'Published Industry',
            'title_ar' => 'قطاع منشور',
            'slug' => 'published-industry',
            'status' => 'published',
            'sort_order' => 10,
        ]);
        $this->createIndustry(['slug' => 'draft-industry', 'status' => 'draft']);
        $this->createIndustry(['slug' => 'archived-industry', 'status' => 'archived']);
        $deleted = $this->createIndustry(['slug' => 'deleted-industry', 'status' => 'published']);
        $deleted->delete();

        $this->get(route('industries'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/industries')
                ->where('hasPublishedIndustries', true)
                ->has('industries', 1)
                ->where('industries.0.slug', $published->slug)
                ->where('industries.0.title.en', 'Published Industry')
                ->where('industries.0.title.ar', 'قطاع منشور'));
    }

    public function test_homepage_shows_only_published_featured_services(): void
    {
        $featured = $this->createService([
            'title_en' => 'Featured Service',
            'slug' => 'featured-service',
            'status' => 'published',
            'is_featured' => true,
        ]);
        $this->createService(['slug' => 'not-featured', 'status' => 'published', 'is_featured' => false]);
        $this->createService(['slug' => 'draft-featured', 'status' => 'draft', 'is_featured' => true]);
        $deleted = $this->createService(['slug' => 'deleted-featured', 'status' => 'published', 'is_featured' => true]);
        $deleted->delete();

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/home')
                ->where('hasPublishedServices', true)
                ->has('services', 1)
                ->where('services.0.slug', $featured->slug)
                ->where('services.0.title.en', 'Featured Service'));
    }

    public function test_public_pages_report_static_fallback_when_no_published_records_exist(): void
    {
        $this->get(route('services'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/services')
                ->where('hasPublishedServices', false)
                ->has('services', 0));

        $this->get(route('industries'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/industries')
                ->where('hasPublishedIndustries', false)
                ->has('industries', 0));
    }

    private function createService(array $overrides = []): Service
    {
        return Service::create([
            'title_en' => 'Statistical Studies',
            'title_ar' => 'الدراسات الإحصائية',
            'slug' => 'statistical-studies',
            'short_description_en' => 'English short description.',
            'short_description_ar' => 'وصف عربي مختصر.',
            'description_en' => 'English description.',
            'description_ar' => 'وصف عربي.',
            'icon' => 'statistical-consulting',
            'image_path' => null,
            'status' => 'published',
            'is_featured' => false,
            'sort_order' => 10,
            'seo_title_en' => null,
            'seo_title_ar' => null,
            'seo_description_en' => null,
            'seo_description_ar' => null,
            ...$overrides,
        ]);
    }

    private function createIndustry(array $overrides = []): Industry
    {
        return Industry::create([
            'title_en' => 'Businesses and Private Sector',
            'title_ar' => 'الشركات والقطاع الخاص',
            'slug' => 'businesses-private-sector',
            'description_en' => 'English industry description.',
            'description_ar' => 'وصف عربي للقطاع.',
            'icon' => 'building',
            'image_path' => null,
            'status' => 'published',
            'sort_order' => 10,
            ...$overrides,
        ]);
    }
}
