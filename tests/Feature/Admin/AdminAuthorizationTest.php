<?php

namespace Tests\Feature\Admin;

use App\Models\Inquiry;
use App\Models\StudyRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    }

    public function test_inactive_admin_users_are_forbidden(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'is_active' => false,
        ]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_active_admin_roles_can_access_admin_dashboard(): void
    {
        foreach (User::ADMIN_ROLES as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'is_active' => true,
            ]);

            $this->actingAs($user)
                ->get(route('admin.dashboard'))
                ->assertOk();
        }
    }

    public function test_viewers_have_read_only_access_to_leads(): void
    {
        $viewer = User::factory()->create([
            'role' => 'viewer',
            'is_active' => true,
        ]);
        $inquiry = $this->createInquiry();
        $studyRequest = $this->createStudyRequest();

        $this->actingAs($viewer)
            ->patch(route('admin.inquiries.update', $inquiry), [
                'status' => 'resolved',
                'assigned_to' => null,
                'internal_notes' => 'Should not be stored.',
            ])
            ->assertForbidden();

        $this->actingAs($viewer)
            ->patch(route('admin.study-requests.update', $studyRequest), [
                'status' => 'closed',
                'assigned_to' => null,
                'internal_notes' => 'Should not be stored.',
            ])
            ->assertForbidden();

        $this->assertDatabaseMissing('inquiries', [
            'id' => $inquiry->id,
            'internal_notes' => 'Should not be stored.',
        ]);
        $this->assertDatabaseMissing('study_requests', [
            'id' => $studyRequest->id,
            'internal_notes' => 'Should not be stored.',
        ]);
    }

    private function createInquiry(): Inquiry
    {
        return Inquiry::create([
            'name' => 'Contact Person',
            'email' => 'contact@example.test',
            'subject' => 'general-inquiry',
            'message' => 'A detailed inquiry about research support.',
            'status' => 'new',
        ]);
    }

    private function createStudyRequest(): StudyRequest
    {
        return StudyRequest::create([
            'request_number' => 'ED-TEST-001',
            'full_name' => 'Study Contact',
            'email' => 'study@example.test',
            'client_type' => 'ngo',
            'service_type' => 'monitoring-evaluation',
            'project_description' => 'A detailed study request that needs review.',
            'status' => 'new',
        ]);
    }
}
