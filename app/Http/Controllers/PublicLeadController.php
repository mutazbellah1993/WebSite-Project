<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Requests\StoreStudyRequest;
use App\Models\Inquiry;
use App\Models\StudyRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicLeadController extends Controller
{
    public function storeStudyRequest(StoreStudyRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['consent', 'website']);

        StudyRequest::create([
            ...$data,
            'request_number' => $this->generateStudyRequestNumber(),
            'status' => 'new',
            'preferred_language' => app()->getLocale(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Your study request has been received.'),
        ]);

        return back();
    }

    public function storeContactMessage(StoreContactMessageRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['consent', 'website']);

        Inquiry::create([
            ...$data,
            'status' => 'new',
            'preferred_language' => app()->getLocale(),
            'source' => 'website',
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 1000, ''),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Your message has been received.'),
        ]);

        return back();
    }

    private function generateStudyRequestNumber(): string
    {
        do {
            $requestNumber = 'ED-' . now()->format('Ymd-His') . '-' . Str::upper(Str::random(6));
        } while (StudyRequest::query()->where('request_number', $requestNumber)->exists());

        return $requestNumber;
    }
}
