<?php

namespace Tests\Feature\Admin;

use App\Models\ContentCategory;
use App\Models\Insight;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminInsightManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_insights(): void
    {
        $this->get(route('admin.insights.index'))->assertRedirect(route('login'));
    }

    public function test_viewer_can_view_but_cannot_modify_insights(): void
    {
        $viewer = User::factory()->create(['role' => 'viewer', 'is_active' => true]);
        $insight = $this->createInsight();

        $this->actingAs($viewer)
            ->get(route('admin.insights.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/insights/index')
                ->where('canManageContent', false));

        $this->actingAs($viewer)
            ->get(route('admin.insights.create'))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->post(route('admin.insights.store'), $this->insightPayload(['slug' => 'viewer-insight']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->patch(route('admin.insights.update', $insight), $this->insightPayload(['title_en' => 'Viewer Update']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->delete(route('admin.insights.destroy', $insight))
            ->assertForbidden();
    }

    public function test_editor_can_create_update_publish_and_sync_categories(): void
    {
        Storage::fake('public');
        Storage::fake('local');

        $editor = User::factory()->create(['role' => 'editor', 'is_active' => true]);
        $category = $this->createCategory();

        $this->actingAs($editor)
            ->post(route('admin.insights.store'), $this->insightPayload([
                'type' => 'report',
                'slug' => '',
                'title_en' => 'Quarterly Evidence Brief',
                'status' => 'published',
                'categories' => [$category->id],
                'body_en' => '<script>alert("x")</script><p onclick="bad()">English body.</p>',
                'body_ar' => '<iframe src="bad"></iframe><p>نص عربي.</p>',
                'cover_image' => UploadedFile::fake()->create('original.jpg', 100, 'image/jpeg'),
                'report_attachment' => UploadedFile::fake()->create('original.pdf', 100, 'application/pdf'),
            ]))
            ->assertRedirect();

        $insight = Insight::query()->where('title_en', 'Quarterly Evidence Brief')->firstOrFail();

        $this->assertSame('quarterly-evidence-brief', $insight->slug);
        $this->assertSame($editor->id, $insight->author_id);
        $this->assertSame('published', $insight->status);
        $this->assertTrue($insight->categories()->first()?->is($category));
        $this->assertStringNotContainsString('<script', (string) $insight->body_en);
        $this->assertStringNotContainsString('onclick', (string) $insight->body_en);
        $this->assertStringNotContainsString('<iframe', (string) $insight->body_ar);
        $this->assertNotNull($insight->cover_image_path);
        $this->assertNotNull($insight->attachment_path);
        Storage::disk('public')->assertExists($insight->cover_image_path);
        Storage::disk('local')->assertExists($insight->attachment_path);

        $oldCover = $insight->cover_image_path;
        $oldReport = $insight->attachment_path;
        $secondCategory = $this->createCategory(['slug' => 'data-analytics', 'name_en' => 'Data Analytics']);

        $this->actingAs($editor)
            ->from(route('admin.insights.edit', $insight))
            ->patch(route('admin.insights.update', $insight), $this->insightPayload([
                'type' => 'article',
                'slug' => '',
                'title_en' => 'Updated Evidence Brief',
                'status' => 'archived',
                'categories' => [$secondCategory->id],
                'cover_image' => UploadedFile::fake()->create('replacement.webp', 100, 'image/webp'),
                'report_attachment' => UploadedFile::fake()->create('replacement.pdf', 100, 'application/pdf'),
            ]))
            ->assertRedirect(route('admin.insights.edit', $insight));

        $insight->refresh();

        $this->assertSame('Updated Evidence Brief', $insight->title_en);
        $this->assertSame('quarterly-evidence-brief', $insight->slug);
        $this->assertSame('archived', $insight->status);
        $this->assertTrue($insight->categories()->first()?->is($secondCategory));
        Storage::disk('public')->assertMissing($oldCover);
        Storage::disk('local')->assertMissing($oldReport);
        Storage::disk('public')->assertExists($insight->cover_image_path);
        Storage::disk('local')->assertExists($insight->attachment_path);
    }

    public function test_admin_and_super_admin_have_full_insight_access(): void
    {
        foreach (['admin', 'super_admin'] as $role) {
            $user = User::factory()->create(['role' => $role, 'is_active' => true]);
            $insight = $this->createInsight(['slug' => "{$role}-insight"]);

            $this->actingAs($user)
                ->get(route('admin.insights.edit', $insight))
                ->assertOk();

            $this->actingAs($user)
                ->delete(route('admin.insights.destroy', $insight))
                ->assertRedirect(route('admin.insights.index'));

            $this->assertSoftDeleted('insights', ['id' => $insight->id]);

            $this->actingAs($user)
                ->patch(route('admin.insights.restore', $insight))
                ->assertRedirect(route('admin.insights.edit', $insight));

            $this->assertNotSoftDeleted('insights', ['id' => $insight->id]);
        }
    }

    public function test_inactive_user_is_blocked_from_insight_management(): void
    {
        $inactive = User::factory()->create(['role' => 'admin', 'is_active' => false]);

        $this->actingAs($inactive)
            ->get(route('admin.insights.index'))
            ->assertForbidden();
    }

    public function test_unauthorized_role_cannot_modify_insights(): void
    {
        $user = new User([
            'name' => 'Research User',
            'email' => 'researcher@example.test',
            'role' => 'researcher',
            'is_active' => true,
        ]);
        $user->id = 999;

        $this->actingAs($user)
            ->post(route('admin.insights.store'), $this->insightPayload())
            ->assertForbidden();
    }

    public function test_insight_validation_duplicate_slugs_categories_and_files_are_enforced(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->createInsight(['slug' => 'duplicate-insight']);

        $this->actingAs($admin)
            ->from(route('admin.insights.create'))
            ->post(route('admin.insights.store'), $this->insightPayload([
                'type' => 'invalid',
                'title_en' => '',
                'title_ar' => '',
                'slug' => 'duplicate-insight',
                'status' => 'invalid',
                'categories' => [999999],
                'cover_image' => UploadedFile::fake()->create('bad.svg', 10, 'image/svg+xml'),
                'report_attachment' => UploadedFile::fake()->create('bad.txt', 10, 'text/plain'),
            ]))
            ->assertRedirect(route('admin.insights.create'))
            ->assertSessionHasErrors(['type', 'title_en', 'title_ar', 'slug', 'status', 'categories.0', 'cover_image', 'report_attachment']);
    }

    public function test_published_content_requires_public_fields(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->actingAs($admin)
            ->from(route('admin.insights.create'))
            ->post(route('admin.insights.store'), $this->insightPayload([
                'status' => 'published',
                'excerpt_en' => '',
                'excerpt_ar' => '',
                'body_en' => '',
                'body_ar' => '',
            ]))
            ->assertRedirect(route('admin.insights.create'))
            ->assertSessionHasErrors(['excerpt_en', 'excerpt_ar', 'body_en', 'body_ar']);
    }

    private function createCategory(array $overrides = []): ContentCategory
    {
        return ContentCategory::create([
            'slug' => 'statistical-research',
            'name_en' => 'Statistical Research',
            'name_ar' => 'البحث الإحصائي',
            'description_en' => 'English category description.',
            'description_ar' => 'وصف عربي للتصنيف.',
            ...$overrides,
        ]);
    }

    private function createInsight(array $overrides = []): Insight
    {
        return Insight::create([
            'type' => 'article',
            'slug' => 'sampling-note',
            'title_en' => 'Sampling note',
            'title_ar' => 'ملاحظة حول العينة',
            'excerpt_en' => 'English excerpt.',
            'excerpt_ar' => 'موجز عربي.',
            'body_en' => '<p>English body.</p>',
            'body_ar' => '<p>نص عربي.</p>',
            'status' => 'draft',
            'is_featured' => false,
            'published_at' => null,
            ...$overrides,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function insightPayload(array $overrides = []): array
    {
        return [
            'type' => 'article',
            'title_en' => 'Sampling note',
            'title_ar' => 'ملاحظة حول العينة',
            'slug' => 'sampling-note',
            'excerpt_en' => 'English excerpt.',
            'excerpt_ar' => 'موجز عربي.',
            'body_en' => '<p>English body.</p>',
            'body_ar' => '<p>نص عربي.</p>',
            'categories' => [],
            'is_featured' => false,
            'status' => 'draft',
            'published_at' => null,
            'seo_title_en' => 'Sampling note',
            'seo_title_ar' => 'ملاحظة حول العينة',
            'seo_description_en' => 'English SEO description.',
            'seo_description_ar' => 'وصف عربي لمحركات البحث.',
            ...$overrides,
        ];
    }
}
