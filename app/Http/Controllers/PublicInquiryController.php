<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Requests\StoreStudyRequest;
use App\Models\PublicInquiry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class PublicInquiryController extends Controller
{
    public function storeStudyRequest(StoreStudyRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['consent', 'website']);

        PublicInquiry::create([
            ...$data,
            'type' => PublicInquiry::TYPE_STUDY_REQUEST,
            'status' => 'new',
            'locale' => app()->getLocale(),
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

        PublicInquiry::create([
            ...$data,
            'type' => PublicInquiry::TYPE_CONTACT_MESSAGE,
            'status' => 'new',
            'locale' => app()->getLocale(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Your message has been received.'),
        ]);

        return back();
    }
}
