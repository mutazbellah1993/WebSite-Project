<?php

namespace Tests\Feature\Admin;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminInquiryManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_search_filter_and_view_inquiries(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $match = $this->createInquiry([
            'name' => 'Alya Research',
            'email' => 'alya@example.test',
            'status' => 'new',
            'internal_notes' => 'Private admin note.',
        ]);
        $this->createInquiry([
            'name' => 'Other Contact',
            'email' => 'other@example.test',
            'status' => 'resolved',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.inquiries.index', ['search' => 'Alya', 'status' => 'new']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/inquiries/index')
                ->has('inquiries.data', 1)
                ->where('inquiries.data.0.email', 'alya@example.test')
                ->where('filters.search', 'Alya')
                ->where('filters.status', 'new'));

        $this->actingAs($admin)
            ->get(route('admin.inquiries.show', $match))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/inquiries/show')
                ->where('inquiry.id', $match->id)
                ->where('inquiry.internal_notes', 'Private admin note.'));
    }

    public function test_editor_can_update_inquiry_assignment_notes_and_status(): void
    {
        $editor = User::factory()->create(['role' => 'editor', 'is_active' => true]);
        $assignee = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $inquiry = $this->createInquiry();

        $this->actingAs($editor)
            ->patch(route('admin.inquiries.update', $inquiry), [
                'status' => 'resolved',
                'assigned_to' => $assignee->id,
                'internal_notes' => 'Followed up and resolved.',
            ])
            ->assertRedirect();

        $inquiry->refresh();

        $this->assertSame('resolved', $inquiry->status);
        $this->assertSame($assignee->id, $inquiry->assigned_to);
        $this->assertSame('Followed up and resolved.', $inquiry->internal_notes);
        $this->assertNotNull($inquiry->responded_at);
    }

    public function test_inquiry_update_rejects_inactive_assignees(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $inactiveAssignee = User::factory()->create(['role' => 'admin', 'is_active' => false]);
        $inquiry = $this->createInquiry();

        $this->actingAs($admin)
            ->from(route('admin.inquiries.show', $inquiry))
            ->patch(route('admin.inquiries.update', $inquiry), [
                'status' => 'in_progress',
                'assigned_to' => $inactiveAssignee->id,
                'internal_notes' => 'Invalid assignment.',
            ])
            ->assertRedirect(route('admin.inquiries.show', $inquiry))
            ->assertSessionHasErrors('assigned_to');

        $this->assertNull($inquiry->refresh()->assigned_to);
    }

    public function test_admin_can_soft_delete_and_restore_inquiry(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $inquiry = $this->createInquiry();

        $this->actingAs($admin)
            ->delete(route('admin.inquiries.destroy', $inquiry))
            ->assertRedirect(route('admin.inquiries.index'));

        $this->assertSoftDeleted('inquiries', ['id' => $inquiry->id]);

        $this->actingAs($admin)
            ->patch(route('admin.inquiries.restore', $inquiry->id))
            ->assertRedirect(route('admin.inquiries.show', $inquiry->id));

        $this->assertNotSoftDeleted('inquiries', ['id' => $inquiry->id]);
    }

    private function createInquiry(array $overrides = []): Inquiry
    {
        return Inquiry::create([
            'name' => 'Contact Person',
            'email' => 'contact@example.test',
            'phone' => '+963000000001',
            'organization' => 'Institution',
            'subject' => 'general-inquiry',
            'message' => 'A detailed inquiry about research and analytics support.',
            'status' => 'new',
            ...$overrides,
        ]);
    }
}
