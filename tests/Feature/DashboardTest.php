<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authorized_active_users_are_redirected_to_admin_dashboard()
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response
            ->assertStatus(302)
            ->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_authorized_active_users_can_visit_admin_dashboard()
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk();
    }

    public function test_inactive_users_cannot_use_dashboard_redirect_to_bypass_admin_access()
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'is_active' => false,
        ]);
        $this->actingAs($user);

        $this->get(route('dashboard'))->assertForbidden();
    }
}
