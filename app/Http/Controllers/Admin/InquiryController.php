<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateInquiryRequest;
use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Inquiry::class);

        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', '');
        $trashed = (string) $request->query('trashed', '');

        $query = Inquiry::query()
            ->with('assignee:id,name,email,role')
            ->latest();

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if (in_array($status, Inquiry::STATUSES, true)) {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($query) use ($search): void {
                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('organization', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(fn (Inquiry $inquiry): array => $this->listItem($inquiry)),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'trashed' => $trashed,
            ],
            'statuses' => Inquiry::STATUSES,
            'canManageLeads' => $request->user()?->canManageLeads() ?? false,
        ]);
    }

    public function show(Request $request, Inquiry $inquiry): Response
    {
        Gate::authorize('view', $inquiry);

        $inquiry->load('assignee:id,name,email,role');

        return Inertia::render('admin/inquiries/show', [
            'inquiry' => $this->detailItem($inquiry),
            'statuses' => Inquiry::STATUSES,
            'assignees' => $this->assignees(),
            'canManageLeads' => $request->user()?->can('update', $inquiry) ?? false,
        ]);
    }

    public function update(UpdateInquiryRequest $request, Inquiry $inquiry): RedirectResponse
    {
        $data = $request->validated();

        if ($data['status'] === 'resolved' && $inquiry->responded_at === null) {
            $data['responded_at'] = now();
        }

        $inquiry->update($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Inquiry updated.'),
        ]);

        return back();
    }

    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        Gate::authorize('delete', $inquiry);

        $inquiry->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Inquiry deleted.'),
        ]);

        return redirect()->route('admin.inquiries.index');
    }

    public function restore(Inquiry $inquiry): RedirectResponse
    {
        Gate::authorize('restore', $inquiry);

        $inquiry->restore();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Inquiry restored.'),
        ]);

        return redirect()->route('admin.inquiries.show', $inquiry);
    }

    /**
     * @return list<array{id: int, name: string, email: string, role: string}>
     */
    private function assignees(): array
    {
        return User::query()
            ->where('is_active', true)
            ->whereIn('role', User::LEAD_MANAGER_ROLES)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role'])
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ])
            ->all();
    }

    private function listItem(Inquiry $inquiry): array
    {
        return [
            'id' => $inquiry->id,
            'name' => $inquiry->name,
            'email' => $inquiry->email,
            'phone' => $inquiry->phone,
            'organization' => $inquiry->organization,
            'subject' => $inquiry->subject,
            'status' => $inquiry->status,
            'assigned_to' => $inquiry->assigned_to,
            'assignee' => $this->assigneeItem($inquiry->assignee),
            'created_at' => $inquiry->created_at?->toISOString(),
            'deleted_at' => $inquiry->deleted_at?->toISOString(),
        ];
    }

    private function detailItem(Inquiry $inquiry): array
    {
        return [
            ...$this->listItem($inquiry),
            'message' => $inquiry->message,
            'preferred_language' => $inquiry->preferred_language,
            'internal_notes' => $inquiry->internal_notes,
            'source' => $inquiry->source,
            'ip_address' => $inquiry->ip_address,
            'user_agent' => $inquiry->user_agent,
            'responded_at' => $inquiry->responded_at?->toISOString(),
            'updated_at' => $inquiry->updated_at?->toISOString(),
        ];
    }

    private function assigneeItem(?User $user): ?array
    {
        if (! $user) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }
}
