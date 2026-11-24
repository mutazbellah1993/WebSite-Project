<?php

namespace Tests\Feature;

use App\Models\CaseStudy;
use Database\Seeders\AnalyticalProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicProjectsTest extends TestCase
{
    use RefreshDatabase;

    public function test_listing_shows_only_published_available_projects(): void
    {
        $published = $this->createProject(['slug' => 'published-project', 'title_en' => 'Published Project', 'title_ar' => 'مشروع منشور']);
        $this->createProject(['slug' => 'draft-project', 'status' => 'draft']);
        $this->createProject(['slug' => 'archived-project', 'status' => 'archived']);
        $this->createProject(['slug' => 'future-project', 'published_at' => now()->addDay()]);
        $this->createProject(['slug' => 'deleted-project'])->delete();

        $this->get(route('projects'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/projects')
                ->has('projects', 1)
                ->where('projects.0.slug', $published->slug)
                ->where('projects.0.title.en', 'Published Project')
                ->where('projects.0.title.ar', 'مشروع منشور'));
    }

    public function test_detail_page_returns_localized_sanitized_content(): void
    {
        $project = $this->createProject([
            'slug' => 'detail-project',
            'challenge_en' => '<p>Challenge</p><script>alert(1)</script>',
            'challenge_ar' => '<p>التحدي</p>',
            'live_url' => 'https://dashboards.example.com/syria',
        ]);

        $this->get(route('projects.show', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/project-show')
                ->where('project.slug', 'detail-project')
                ->where('project.challenge.ar', '<p>التحدي</p>')
                ->where('project.live_url', 'https://dashboards.example.com/syria')
                ->where('seo.structuredData.@type', 'CreativeWork')
                ->where('project.challenge.en', fn ($html) => ! str_contains((string) $html, 'script')));
    }

    public function test_non_http_live_links_are_not_exposed(): void
    {
        $project = $this->createProject(['slug' => 'unsafe-link', 'live_url' => 'javascript:alert(1)']);

        $this->get(route('projects.show', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('project.live_url', null)->where('project.has_live_url', false));
    }

    public function test_unavailable_projects_return_not_found(): void
    {
        $draft = $this->createProject(['slug' => 'draft-detail', 'status' => 'draft']);
        $future = $this->createProject(['slug' => 'future-detail', 'published_at' => now()->addDay()]);
        $this->createProject(['slug' => 'deleted-detail'])->delete();

        $this->get(route('projects.show', $draft))->assertNotFound();
        $this->get(route('projects.show', $future))->assertNotFound();
        $this->get('/projects/deleted-detail')->assertNotFound();
        $this->get('/projects/not-a-real-slug')->assertNotFound();
    }

    public function test_sitemap_lists_published_projects_only(): void
    {
        $this->createProject(['slug' => 'in-sitemap']);
        $this->createProject(['slug' => 'draft-not-in-sitemap', 'status' => 'draft']);

        $this->get(route('sitemap'))
            ->assertOk()
            ->assertSee(route('projects'), false)
            ->assertSee('/projects/in-sitemap', false)
            ->assertDontSee('draft-not-in-sitemap', false);
    }

    public function test_seeder_publishes_the_syria_dashboard_project_and_is_repeatable(): void
    {
        config(['elitedata.projects.syria_dashboard_url' => 'https://dashboards.example.com']);

        $this->seed(AnalyticalProjectSeeder::class);
        $firstPublishedAt = CaseStudy::where('slug', 'syria-humanitarian-dashboard')->value('published_at');
        $this->seed(AnalyticalProjectSeeder::class);

        $this->assertSame(1, CaseStudy::where('slug', 'syria-humanitarian-dashboard')->count());
        $this->assertEquals($firstPublishedAt, CaseStudy::where('slug', 'syria-humanitarian-dashboard')->value('published_at'));

        $this->get('/projects/syria-humanitarian-dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('project.live_url', 'https://dashboards.example.com')
                ->where('project.methodology.ar', fn ($html) => str_contains((string) $html, '275'))
                ->where('project.results.en', fn ($html) => str_contains((string) $html, 'did not survive new data')));
    }

    private function createProject(array $overrides = []): CaseStudy
    {
        return CaseStudy::create([
            'slug' => 'sample-project',
            'title_en' => 'Sample project',
            'title_ar' => 'مشروع تجريبي',
            'summary_en' => 'English summary.',
            'summary_ar' => 'ملخص عربي.',
            'challenge_en' => '<p>English challenge.</p>',
            'challenge_ar' => '<p>تحدٍ عربي.</p>',
            'status' => 'published',
            'published_at' => now()->subDay(),
            ...$overrides,
        ]);
    }
}
