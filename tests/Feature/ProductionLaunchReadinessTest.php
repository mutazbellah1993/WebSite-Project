<?php

namespace Tests\Feature;

use App\Models\Insight;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductionLaunchReadinessTest extends TestCase
{
    use RefreshDatabase;

    public function test_launch_public_routes_are_available(): void
    {
        $routes = [
            route('home'),
            route('about'),
            route('services'),
            route('industries'),
            route('insights'),
            route('request-study'),
            route('contact'),
            route('privacy'),
            route('terms'),
        ];

        foreach ($routes as $route) {
            $this->get($route)
                ->assertOk()
                ->assertDontSee('Laravel Starter Kit');
        }
    }

    public function test_sitemap_contains_public_routes_and_published_insights_only(): void
    {
        $published = Insight::create([
            'type' => 'article',
            'slug' => 'published-launch-note',
            'title_en' => 'Published launch note',
            'title_ar' => 'ملاحظة إطلاق منشورة',
            'excerpt_en' => 'English excerpt.',
            'excerpt_ar' => 'موجز عربي.',
            'body_en' => '<p>English body.</p>',
            'body_ar' => '<p>نص عربي.</p>',
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);

        Insight::create([
            'type' => 'article',
            'slug' => 'draft-launch-note',
            'title_en' => 'Draft launch note',
            'title_ar' => 'مسودة إطلاق',
            'status' => 'draft',
        ]);

        $this->get(route('sitemap'))
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('<urlset', false)
            ->assertSee(route('home'), false)
            ->assertSee(route('privacy'), false)
            ->assertSee(route('insights.show', $published), false)
            ->assertDontSee('/admin', false)
            ->assertDontSee('/login', false)
            ->assertDontSee('draft-launch-note', false);
    }

    public function test_robots_txt_excludes_private_surfaces(): void
    {
        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('Disallow: /admin')
            ->assertSee('Disallow: /login')
            ->assertSee('Sitemap: https://elitedata.pro/sitemap.xml');
    }

    public function test_admin_routes_remain_protected_from_guests(): void
    {
        $routes = [
            route('admin.dashboard'),
            route('admin.inquiries.index'),
            route('admin.study-requests.index'),
            route('admin.services.index'),
            route('admin.industries.index'),
            route('admin.insights.index'),
            route('admin.content-categories.index'),
        ];

        foreach ($routes as $route) {
            $this->get($route)->assertRedirect(route('login'));
        }
    }

    public function test_viewer_remains_read_only_for_launch_admin_content(): void
    {
        $viewer = User::factory()->create(['role' => 'viewer', 'is_active' => true]);

        $this->actingAs($viewer)
            ->get(route('admin.services.index'))
            ->assertOk();

        $this->actingAs($viewer)
            ->get(route('admin.services.create'))
            ->assertForbidden();
    }

    public function test_custom_error_pages_are_branded(): void
    {
        $this->get('/missing-launch-page')
            ->assertNotFound()
            ->assertSee('ELITEDATA')
            ->assertSee('Return Home');

        $this->assertStringContainsString('ELITEDATA', view('errors.500')->render());
    }
}
