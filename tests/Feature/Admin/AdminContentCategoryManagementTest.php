<?php

namespace Tests\Feature\Admin;

use App\Models\ContentCategory;
use App\Models\Insight;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminContentCategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_content_categories(): void
    {
        $this->get(route('admin.content-categories.index'))->assertRedirect(route('login'));
    }

    public function test_viewer_can_view_but_cannot_modify_categories(): void
    {
        $viewer = User::factory()->create(['role' => 'viewer', 'is_active' => true]);
        $category = $this->createCategory();

        $this->actingAs($viewer)
            ->get(route('admin.content-categories.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/content-categories/index')
                ->where('canManageContent', false));

        $this->actingAs($viewer)
            ->get(route('admin.content-categories.create'))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->post(route('admin.content-categories.store'), $this->categoryPayload(['slug' => 'viewer-category']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->patch(route('admin.content-categories.update', $category), $this->categoryPayload(['name_en' => 'Viewer Update']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->delete(route('admin.content-categories.destroy', $category))
            ->assertForbidden();
    }

    public function test_editor_can_create_and_update_categories(): void
    {
        $editor = User::factory()->create(['role' => 'editor', 'is_active' => true]);

        $this->actingAs($editor)
            ->post(route('admin.content-categories.store'), $this->categoryPayload([
                'slug' => '',
                'name_en' => 'Monitoring and Evaluation',
            ]))
            ->assertRedirect();

        $category = ContentCategory::query()->where('name_en', 'Monitoring and Evaluation')->firstOrFail();

        $this->assertSame('monitoring-and-evaluation', $category->slug);

        $this->actingAs($editor)
            ->from(route('admin.content-categories.edit', $category))
            ->patch(route('admin.content-categories.update', $category), $this->categoryPayload([
                'slug' => '',
                'name_en' => 'Updated Monitoring and Evaluation',
            ]))
            ->assertRedirect(route('admin.content-categories.edit', $category))
            ->assertSessionHasNoErrors();

        $category->refresh();

        $this->assertSame('Updated Monitoring and Evaluation', $category->name_en);
        $this->assertSame('monitoring-and-evaluation', $category->slug);
    }

    public function test_admin_and_super_admin_can_delete_safe_categories(): void
    {
        foreach (['admin', 'super_admin'] as $role) {
            $user = User::factory()->create(['role' => $role, 'is_active' => true]);
            $category = $this->createCategory(['slug' => "{$role}-category"]);

            $this->actingAs($user)
                ->delete(route('admin.content-categories.destroy', $category))
                ->assertRedirect(route('admin.content-categories.index'));

            $this->assertDatabaseMissing('content_categories', ['id' => $category->id]);
        }
    }

    public function test_linked_categories_are_not_deleted_accidentally(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $category = $this->createCategory();
        $insight = $this->createInsight();
        $insight->categories()->attach($category);

        $this->actingAs($admin)
            ->from(route('admin.content-categories.edit', $category))
            ->delete(route('admin.content-categories.destroy', $category))
            ->assertRedirect(route('admin.content-categories.edit', $category))
            ->assertSessionHasErrors('content_category');

        $this->assertDatabaseHas('content_categories', ['id' => $category->id]);
    }

    public function test_inactive_user_is_blocked_from_category_management(): void
    {
        $inactive = User::factory()->create(['role' => 'admin', 'is_active' => false]);

        $this->actingAs($inactive)
            ->get(route('admin.content-categories.index'))
            ->assertForbidden();
    }

    public function test_category_validation_and_duplicate_slugs_are_enforced(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->createCategory(['slug' => 'duplicate-category']);

        $this->actingAs($admin)
            ->from(route('admin.content-categories.create'))
            ->post(route('admin.content-categories.store'), $this->categoryPayload([
                'name_en' => '',
                'name_ar' => '',
                'slug' => 'duplicate-category',
            ]))
            ->assertRedirect(route('admin.content-categories.create'))
            ->assertSessionHasErrors(['name_en', 'name_ar', 'slug']);
    }

    private function createCategory(array $overrides = []): ContentCategory
    {
        return ContentCategory::create([
            ...$this->categoryPayload(),
            ...$overrides,
        ]);
    }

    private function createInsight(array $overrides = []): Insight
    {
        return Insight::create([
            'type' => 'article',
            'slug' => 'category-linked-insight',
            'title_en' => 'Category linked insight',
            'title_ar' => 'رؤية مرتبطة بالتصنيف',
            'excerpt_en' => 'English excerpt.',
            'excerpt_ar' => 'موجز عربي.',
            'body_en' => '<p>English body.</p>',
            'body_ar' => '<p>نص عربي.</p>',
            'status' => 'draft',
            ...$overrides,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function categoryPayload(array $overrides = []): array
    {
        return [
            'name_en' => 'Statistical Research',
            'name_ar' => 'البحث الإحصائي',
            'slug' => 'statistical-research',
            'description_en' => 'English category description.',
            'description_ar' => 'وصف عربي للتصنيف.',
            ...$overrides,
        ];
    }
}
