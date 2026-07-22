<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Requests\StoreStudyRequest;
use App\Models\Inquiry;
use App\Models\StudyRequest;
use App\Notifications\PublicInquiryReceived;
use App\Notifications\StudyRequestReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Throwable;

class PublicLeadController extends Controller
{
    public function storeStudyRequest(StoreStudyRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['consent', 'website']);

        $studyRequest = StudyRequest::create([
            ...$data,
            'request_number' => $this->generateStudyRequestNumber(),
            'status' => 'new',
            'preferred_language' => app()->getLocale(),
        ]);

        $this->notifyCompany(new StudyRequestReceived($studyRequest));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Your study request has been received.'),
        ]);

        return back();
    }

    public function storeContactMessage(StoreContactMessageRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['consent', 'website']);

        $inquiry = Inquiry::create([
            ...$data,
            'status' => 'new',
            'preferred_language' => app()->getLocale(),
            'source' => 'website',
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 1000, ''),
        ]);

        $this->notifyCompany(new PublicInquiryReceived($inquiry));

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

    private function notifyCompany(Notification $notification): void
    {
        $recipient = config('elitedata.notifications.leads_to');

        if (! is_string($recipient) || trim($recipient) === '') {
            return;
        }

        try {
            NotificationFacade::route('mail', $recipient)->notify($notification);
        } catch (Throwable $exception) {
            Log::warning('Lead notification email failed.', [
                'notification' => $notification::class,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
