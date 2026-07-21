<?php

namespace Tests\Feature\Admin;

use App\Models\StudyRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminStudyRequestManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_search_filter_and_view_study_requests(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $match = $this->createStudyRequest([
            'request_number' => 'ED-TEST-100',
            'full_name' => 'Monitoring Lead',
            'email' => 'monitoring@example.test',
            'client_type' => 'ngo',
            'status' => 'reviewing',
            'internal_notes' => 'Review scope carefully.',
        ]);
        $this->createStudyRequest([
            'request_number' => 'ED-TEST-101',
            'full_name' => 'Market Lead',
            'email' => 'market@example.test',
            'client_type' => 'business',
            'status' => 'new',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.study-requests.index', [
                'search' => 'Monitoring',
                'status' => 'reviewing',
                'client_type' => 'ngo',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/study-requests/index')
                ->has('studyRequests.data', 1)
                ->where('studyRequests.data.0.request_number', 'ED-TEST-100')
                ->where('filters.status', 'reviewing')
                ->where('filters.client_type', 'ngo'));

        $this->actingAs($admin)
            ->get(route('admin.study-requests.show', $match))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/study-requests/show')
                ->where('studyRequest.id', $match->id)
                ->where('studyRequest.internal_notes', 'Review scope carefully.')
                ->where('studyRequest.project_description', $match->project_description));
    }

    public function test_editor_can_update_study_request_and_record_status_transition_timestamps(): void
    {
        $editor = User::factory()->create(['role' => 'editor', 'is_active' => true]);
        $assignee = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $studyRequest = $this->createStudyRequest(['status' => 'reviewing']);

        $proposalTime = Carbon::parse('2026-08-01 10:30:00');
        $this->travelTo($proposalTime);

        $this->actingAs($editor)
            ->patch(route('admin.study-requests.update', $studyRequest), [
                'status' => 'proposal_sent',
                'assigned_to' => $assignee->id,
                'internal_notes' => 'Proposal sent to the requester.',
            ])
            ->assertRedirect();

        $studyRequest->refresh();

        $this->assertSame('proposal_sent', $studyRequest->status);
        $this->assertSame($assignee->id, $studyRequest->assigned_to);
        $this->assertSame('Proposal sent to the requester.', $studyRequest->internal_notes);
        $this->assertSame($proposalTime->toDateTimeString(), $studyRequest->proposal_sent_at?->toDateTimeString());
        $this->assertNull($studyRequest->closed_at);

        $closedTime = Carbon::parse('2026-08-05 15:45:00');
        $this->travelTo($closedTime);

        $this->actingAs($editor)
            ->patch(route('admin.study-requests.update', $studyRequest), [
                'status' => 'closed',
                'assigned_to' => $assignee->id,
                'internal_notes' => 'Closed after completion.',
            ])
            ->assertRedirect();

        $studyRequest->refresh();

        $this->assertSame('closed', $studyRequest->status);
        $this->assertSame($proposalTime->toDateTimeString(), $studyRequest->proposal_sent_at?->toDateTimeString());
        $this->assertSame($closedTime->toDateTimeString(), $studyRequest->closed_at?->toDateTimeString());
    }

    public function test_study_request_update_rejects_invalid_status_and_inactive_assignee(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $inactiveAssignee = User::factory()->create(['role' => 'admin', 'is_active' => false]);
        $studyRequest = $this->createStudyRequest();

        $this->actingAs($admin)
            ->from(route('admin.study-requests.show', $studyRequest))
            ->patch(route('admin.study-requests.update', $studyRequest), [
                'status' => 'invalid',
                'assigned_to' => $inactiveAssignee->id,
                'internal_notes' => 'Invalid update.',
            ])
            ->assertRedirect(route('admin.study-requests.show', $studyRequest))
            ->assertSessionHasErrors(['status', 'assigned_to']);

        $studyRequest->refresh();

        $this->assertSame('new', $studyRequest->status);
        $this->assertNull($studyRequest->assigned_to);
    }

    public function test_admin_can_soft_delete_and_restore_study_request(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $studyRequest = $this->createStudyRequest();

        $this->actingAs($admin)
            ->delete(route('admin.study-requests.destroy', $studyRequest))
            ->assertRedirect(route('admin.study-requests.index'));

        $this->assertSoftDeleted('study_requests', ['id' => $studyRequest->id]);

        $this->actingAs($admin)
            ->patch(route('admin.study-requests.restore', $studyRequest->id))
            ->assertRedirect(route('admin.study-requests.show', $studyRequest->id));

        $this->assertNotSoftDeleted('study_requests', ['id' => $studyRequest->id]);
    }

    private function createStudyRequest(array $overrides = []): StudyRequest
    {
        return StudyRequest::create([
            'request_number' => 'ED-TEST-' . fake()->unique()->numberBetween(1000, 9999),
            'full_name' => 'Study Contact',
            'email' => 'study@example.test',
            'phone' => '+963000000002',
            'organization' => 'Research Organization',
            'job_title' => 'M&E Officer',
            'client_type' => 'ngo',
            'service_type' => 'monitoring-evaluation',
            'study_title' => 'Program evaluation',
            'project_description' => 'A detailed study request that needs a structured methodology and analysis plan.',
            'objectives' => 'Clarify program outcomes.',
            'target_population' => 'Program participants',
            'geographic_scope' => 'Syria',
            'status' => 'new',
            ...$overrides,
        ]);
    }
}
