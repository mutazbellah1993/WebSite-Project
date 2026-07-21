<?php

namespace Tests\Feature\Admin;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminServiceManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_services(): void
    {
        $this->get(route('admin.services.index'))->assertRedirect(route('login'));
    }

    public function test_viewer_can_view_but_cannot_modify_services(): void
    {
        $viewer = User::factory()->create(['role' => 'viewer', 'is_active' => true]);
        $service = $this->createService();

        $this->actingAs($viewer)
            ->get(route('admin.services.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/services/index')
                ->where('canManageContent', false));

        $this->actingAs($viewer)
            ->get(route('admin.services.create'))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->post(route('admin.services.store'), $this->servicePayload(['slug' => 'viewer-service']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->patch(route('admin.services.update', $service), $this->servicePayload(['title_en' => 'Viewer Update']))
            ->assertForbidden();

        $this->actingAs($viewer)
            ->delete(route('admin.services.destroy', $service))
            ->assertForbidden();
    }

    public function test_editor_can_create_and_update_services(): void
    {
        $editor = User::factory()->create(['role' => 'editor', 'is_active' => true]);

        $this->actingAs($editor)
            ->post(route('admin.services.store'), $this->servicePayload([
                'slug' => '',
                'title_en' => 'Custom Analytics Service',
                'status' => 'published',
                'is_featured' => true,
            ]))
            ->assertRedirect();

        $service = Service::query()->where('title_en', 'Custom Analytics Service')->firstOrFail();

        $this->assertSame('custom-analytics-service', $service->slug);
        $this->assertTrue($service->is_featured);
        $this->assertSame('published', $service->status);

        $this->actingAs($editor)
            ->from(route('admin.services.edit', $service))
            ->patch(route('admin.services.update', $service), $this->servicePayload([
                'slug' => '',
                'title_en' => 'Updated Analytics Service',
                'status' => 'archived',
            ]))
            ->assertRedirect(route('admin.services.edit', $service));

        $service->refresh();

        $this->assertSame('Updated Analytics Service', $service->title_en);
        $this->assertSame('custom-analytics-service', $service->slug);
        $this->assertSame('archived', $service->status);
    }

    public function test_admin_and_super_admin_have_full_service_access(): void
    {
        foreach (['admin', 'super_admin'] as $role) {
            $user = User::factory()->create(['role' => $role, 'is_active' => true]);
            $service = $this->createService(['slug' => "{$role}-service"]);

            $this->actingAs($user)
                ->get(route('admin.services.edit', $service))
                ->assertOk();

            $this->actingAs($user)
                ->delete(route('admin.services.destroy', $service))
                ->assertRedirect(route('admin.services.index'));

            $this->assertSoftDeleted('services', ['id' => $service->id]);

            $this->actingAs($user)
                ->patch(route('admin.services.restore', $service->id))
                ->assertRedirect(route('admin.services.edit', $service->id));

            $this->assertNotSoftDeleted('services', ['id' => $service->id]);
        }
    }

    public function test_inactive_user_is_blocked_from_service_management(): void
    {
        $inactive = User::factory()->create(['role' => 'admin', 'is_active' => false]);

        $this->actingAs($inactive)
            ->get(route('admin.services.index'))
            ->assertForbidden();
    }

    public function test_unauthorized_role_cannot_modify_services(): void
    {
        $user = new User([
            'name' => 'Research User',
            'email' => 'researcher@example.test',
            'role' => 'researcher',
            'is_active' => true,
        ]);
        $user->id = 999;

        $this->actingAs($user)
            ->post(route('admin.services.store'), $this->servicePayload())
            ->assertForbidden();
    }

    public function test_service_validation_and_unique_slugs_are_enforced(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->createService(['slug' => 'duplicate-service']);

        $this->actingAs($admin)
            ->from(route('admin.services.create'))
            ->post(route('admin.services.store'), $this->servicePayload([
                'title_en' => '',
                'title_ar' => '',
                'slug' => 'duplicate-service',
                'status' => 'invalid',
                'sort_order' => -1,
                'icon' => '../bad',
                'image_path' => '../secret.txt',
            ]))
            ->assertRedirect(route('admin.services.create'))
            ->assertSessionHasErrors(['title_en', 'title_ar', 'slug', 'status', 'sort_order', 'icon', 'image_path']);
    }

    private function createService(array $overrides = []): Service
    {
        return Service::create([
            ...$this->servicePayload(),
            ...$overrides,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function servicePayload(array $overrides = []): array
    {
        return [
            'title_en' => 'Statistical Studies',
            'title_ar' => 'الدراسات الإحصائية',
            'slug' => 'statistical-studies',
            'short_description_en' => 'Short English service description.',
            'short_description_ar' => 'وصف عربي مختصر للخدمة.',
            'description_en' => 'Full English service description.',
            'description_ar' => 'وصف عربي كامل للخدمة.',
            'icon' => 'statistical-consulting',
            'image_path' => 'images/services/statistical.jpg',
            'status' => 'draft',
            'is_featured' => false,
            'sort_order' => 10,
            'seo_title_en' => 'Statistical Studies',
            'seo_title_ar' => 'الدراسات الإحصائية',
            'seo_description_en' => 'SEO English description.',
            'seo_description_ar' => 'وصف عربي لمحركات البحث.',
            ...$overrides,
        ];
    }
}
