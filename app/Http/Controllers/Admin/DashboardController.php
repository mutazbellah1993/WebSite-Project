<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\StudyRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        Gate::authorize('viewAny', Inquiry::class);
        Gate::authorize('viewAny', StudyRequest::class);

        $requestCounts = StudyRequest::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->all();

        $recentInquiries = Inquiry::query()
            ->latest()
            ->take(6)
            ->get()
            ->map(fn (Inquiry $inquiry): array => [
                'id' => $inquiry->id,
                'type' => 'inquiry',
                'title' => $inquiry->subject ?: $inquiry->name,
                'name' => $inquiry->name,
                'email' => $inquiry->email,
                'status' => $inquiry->status,
                'created_at' => $inquiry->created_at?->toISOString(),
                'href' => route('admin.inquiries.show', $inquiry),
            ]);

        $recentStudyRequests = StudyRequest::query()
            ->latest()
            ->take(6)
            ->get()
            ->map(fn (StudyRequest $studyRequest): array => [
                'id' => $studyRequest->id,
                'type' => 'study_request',
                'title' => $studyRequest->study_title ?: $studyRequest->request_number,
                'name' => $studyRequest->full_name,
                'email' => $studyRequest->email,
                'status' => $studyRequest->status,
                'created_at' => $studyRequest->created_at?->toISOString(),
                'href' => route('admin.study-requests.show', $studyRequest),
            ]);

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'newInquiries' => Inquiry::query()->where('status', 'new')->count(),
                'newStudyRequests' => StudyRequest::query()->where('status', 'new')->count(),
                'requestsByStatus' => collect(StudyRequest::STATUSES)
                    ->map(fn (string $status): array => [
                        'status' => $status,
                        'count' => (int) ($requestCounts[$status] ?? 0),
                    ])
                    ->values(),
            ],
            'recentSubmissions' => $recentInquiries
                ->merge($recentStudyRequests)
                ->sortByDesc('created_at')
                ->take(8)
                ->values(),
            'canManageLeads' => $request->user()?->canManageLeads() ?? false,
        ]);
    }
}
