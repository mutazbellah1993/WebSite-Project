<?php

namespace Tests\Feature\Admin;

use App\Models\Industry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminIndustryManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_industries(): void
    {
        $this->get(route('admin.industries.index'))->assertRedirect(route('login'));
    }

    public function test_viewer_can_view_but_cannot_modify_industries(): void
    {
        $viewer = User::factory()->create(['role' => 'viewer', 'is_active' => true]);
        $industry = $this->createIndustry();

        $this->actingAs($viewer)
            ->get(route('admin.industries.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/industries/index')
                ->where('canManageContent', false));

        $this->actingAs($viewer)
            ->get(route('admin.industries.create'))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->post(route('admin.industries.store'), $this->industryPayload(['slug' => 'viewer-industry']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->patch(route('admin.industries.update', $industry), $this->industryPayload(['title_en' => 'Viewer Update']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->delete(route('admin.industries.destroy', $industry))
            ->assertForbidden();
    }

    public function test_editor_can_create_and_update_industries(): void
    {
        $editor = User::factory()->create(['role' => 'editor', 'is_active' => true]);

        $this->actingAs($editor)
            ->post(route('admin.industries.store'), $this->industryPayload([
                'slug' => '',
                'title_en' => 'Private Sector Research',
                'status' => 'published',
            ]))
            ->assertRedirect();

        $industry = Industry::query()->where('title_en', 'Private Sector Research')->firstOrFail();

        $this->assertSame('private-sector-research', $industry->slug);
        $this->assertSame('published', $industry->status);

        $this->actingAs($editor)
            ->from(route('admin.industries.edit', $industry))
            ->patch(route('admin.industries.update', $industry), $this->industryPayload([
                'slug' => '',
                'title_en' => 'Updated Private Sector Research',
                'status' => 'archived',
            ]))
            ->assertRedirect(route('admin.industries.edit', $industry));

        $industry->refresh();

        $this->assertSame('Updated Private Sector Research', $industry->title_en);
        $this->assertSame('private-sector-research', $industry->slug);
        $this->assertSame('archived', $industry->status);
    }

    public function test_admin_and_super_admin_have_full_industry_access(): void
    {
        foreach (['admin', 'super_admin'] as $role) {
            $user = User::factory()->create(['role' => $role, 'is_active' => true]);
            $industry = $this->createIndustry(['slug' => "{$role}-industry"]);

            $this->actingAs($user)
                ->get(route('admin.industries.edit', $industry))
                ->assertOk();

            $this->actingAs($user)
                ->delete(route('admin.industries.destroy', $industry))
                ->assertRedirect(route('admin.industries.index'));

            $this->assertSoftDeleted('industries', ['id' => $industry->id]);

            $this->actingAs($user)
                ->patch(route('admin.industries.restore', $industry->id))
                ->assertRedirect(route('admin.industries.edit', $industry->id));

            $this->assertNotSoftDeleted('industries', ['id' => $industry->id]);
        }
    }

    public function test_inactive_user_is_blocked_from_industry_management(): void
    {
        $inactive = User::factory()->create(['role' => 'admin', 'is_active' => false]);

        $this->actingAs($inactive)
            ->get(route('admin.industries.index'))
            ->assertForbidden();
    }

    public function test_unauthorized_role_cannot_modify_industries(): void
    {
        $user = new User([
            'name' => 'Research User',
            'email' => 'researcher@example.test',
            'role' => 'researcher',
            'is_active' => true,
        ]);
        $user->id = 999;

        $this->actingAs($user)
            ->post(route('admin.industries.store'), $this->industryPayload())
            ->assertForbidden();
    }

    public function test_industry_validation_and_unique_slugs_are_enforced(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->createIndustry(['slug' => 'duplicate-industry']);

        $this->actingAs($admin)
            ->from(route('admin.industries.create'))
            ->post(route('admin.industries.store'), $this->industryPayload([
                'title_en' => '',
                'title_ar' => '',
                'slug' => 'duplicate-industry',
                'status' => 'invalid',
                'sort_order' => -1,
                'icon' => '../bad',
                'image_path' => '../secret.txt',
            ]))
            ->assertRedirect(route('admin.industries.create'))
            ->assertSessionHasErrors(['title_en', 'title_ar', 'slug', 'status', 'sort_order', 'icon', 'image_path']);
    }

    private function createIndustry(array $overrides = []): Industry
    {
        return Industry::create([
            ...$this->industryPayload(),
            ...$overrides,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function industryPayload(array $overrides = []): array
    {
        return [
            'title_en' => 'Businesses and Private Sector',
            'title_ar' => 'الشركات والقطاع الخاص',
            'slug' => 'businesses-private-sector',
            'description_en' => 'English industry description.',
            'description_ar' => 'وصف عربي للقطاع.',
            'icon' => 'building',
            'image_path' => 'images/industries/business.jpg',
            'status' => 'draft',
            'sort_order' => 10,
            ...$overrides,
        ];
    }
}
