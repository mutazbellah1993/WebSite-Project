<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateStudyRequestRequest;
use App\Models\StudyRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class StudyRequestController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', StudyRequest::class);

        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', '');
        $clientType = (string) $request->query('client_type', '');
        $trashed = (string) $request->query('trashed', '');

        $query = StudyRequest::query()
            ->with('assignee:id,name,email,role')
            ->latest();

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if (in_array($status, StudyRequest::STATUSES, true)) {
            $query->where('status', $status);
        }

        if (in_array($clientType, StudyRequest::CLIENT_TYPES, true)) {
            $query->where('client_type', $clientType);
        }

        if ($search !== '') {
            $query->where(function ($query) use ($search): void {
                $query
                    ->where('request_number', 'like', "%{$search}%")
                    ->orWhere('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('organization', 'like', "%{$search}%")
                    ->orWhere('study_title', 'like', "%{$search}%")
                    ->orWhere('project_description', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/study-requests/index', [
            'studyRequests' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(fn (StudyRequest $studyRequest): array => $this->listItem($studyRequest)),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'client_type' => $clientType,
                'trashed' => $trashed,
            ],
            'statuses' => StudyRequest::STATUSES,
            'clientTypes' => StudyRequest::CLIENT_TYPES,
            'canManageLeads' => $request->user()?->canManageLeads() ?? false,
        ]);
    }

    public function show(Request $request, StudyRequest $studyRequest): Response
    {
        Gate::authorize('view', $studyRequest);

        $studyRequest->load('assignee:id,name,email,role');

        return Inertia::render('admin/study-requests/show', [
            'studyRequest' => $this->detailItem($studyRequest),
            'statuses' => StudyRequest::STATUSES,
            'assignees' => $this->assignees(),
            'canManageLeads' => $request->user()?->can('update', $studyRequest) ?? false,
        ]);
    }

    public function update(UpdateStudyRequestRequest $request, StudyRequest $studyRequest): RedirectResponse
    {
        $data = $request->validated();

        if ($data['status'] === 'proposal_sent' && $studyRequest->proposal_sent_at === null) {
            $data['proposal_sent_at'] = now();
        }

        if ($data['status'] === 'closed' && $studyRequest->closed_at === null) {
            $data['closed_at'] = now();
        }

        $studyRequest->update($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Study request updated.'),
        ]);

        return back();
    }

    public function destroy(StudyRequest $studyRequest): RedirectResponse
    {
        Gate::authorize('delete', $studyRequest);

        $studyRequest->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Study request deleted.'),
        ]);

        return redirect()->route('admin.study-requests.index');
    }

    public function restore(StudyRequest $studyRequest): RedirectResponse
    {
        Gate::authorize('restore', $studyRequest);

        $studyRequest->restore();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Study request restored.'),
        ]);

        return redirect()->route('admin.study-requests.show', $studyRequest);
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

    private function listItem(StudyRequest $studyRequest): array
    {
        return [
            'id' => $studyRequest->id,
            'request_number' => $studyRequest->request_number,
            'full_name' => $studyRequest->full_name,
            'email' => $studyRequest->email,
            'phone' => $studyRequest->phone,
            'organization' => $studyRequest->organization,
            'client_type' => $studyRequest->client_type,
            'service_type' => $studyRequest->service_type,
            'study_title' => $studyRequest->study_title,
            'status' => $studyRequest->status,
            'assigned_to' => $studyRequest->assigned_to,
            'assignee' => $this->assigneeItem($studyRequest->assignee),
            'proposal_sent_at' => $studyRequest->proposal_sent_at?->toISOString(),
            'closed_at' => $studyRequest->closed_at?->toISOString(),
            'created_at' => $studyRequest->created_at?->toISOString(),
            'deleted_at' => $studyRequest->deleted_at?->toISOString(),
        ];
    }

    private function detailItem(StudyRequest $studyRequest): array
    {
        return [
            ...$this->listItem($studyRequest),
            'job_title' => $studyRequest->job_title,
            'project_description' => $studyRequest->project_description,
            'objectives' => $studyRequest->objectives,
            'target_population' => $studyRequest->target_population,
            'geographic_scope' => $studyRequest->geographic_scope,
            'estimated_sample_size' => $studyRequest->estimated_sample_size,
            'desired_start_date' => $studyRequest->desired_start_date?->toDateString(),
            'desired_end_date' => $studyRequest->desired_end_date?->toDateString(),
            'estimated_budget' => $studyRequest->estimated_budget,
            'budget_currency' => $studyRequest->budget_currency,
            'attachment_path' => $studyRequest->attachment_path,
            'preferred_language' => $studyRequest->preferred_language,
            'internal_notes' => $studyRequest->internal_notes,
            'updated_at' => $studyRequest->updated_at?->toISOString(),
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
