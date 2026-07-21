<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\StudyRequestController;
use App\Http\Controllers\PublicLeadController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'public/home')->name('home');
Route::inertia('/about-us', 'public/about')->name('about');
Route::inertia('/services', 'public/services')->name('services');
Route::inertia('/industries', 'public/industries')->name('industries');
Route::inertia('/research-and-insights', 'public/insights')->name('insights');
Route::inertia('/request-a-study', 'public/request-study')->name('request-study');
Route::post('/request-a-study', [PublicLeadController::class, 'storeStudyRequest'])->name('request-study.submit');
Route::inertia('/contact-us', 'public/contact')->name('contact');
Route::post('/contact-us', [PublicLeadController::class, 'storeContactMessage'])->name('contact.submit');

Route::middleware(['auth', 'verified', 'admin.access'])->group(function () {
    Route::get('dashboard', fn () => redirect()->route('admin.dashboard'))->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin.access'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::get('/inquiries', [InquiryController::class, 'index'])->name('inquiries.index');
        Route::get('/inquiries/{inquiry}', [InquiryController::class, 'show'])->withTrashed()->name('inquiries.show');
        Route::patch('/inquiries/{inquiry}', [InquiryController::class, 'update'])
            ->middleware('throttle:admin-actions')
            ->name('inquiries.update');
        Route::delete('/inquiries/{inquiry}', [InquiryController::class, 'destroy'])
            ->middleware('throttle:admin-actions')
            ->name('inquiries.destroy');
        Route::patch('/inquiries/{inquiry}/restore', [InquiryController::class, 'restore'])
            ->withTrashed()
            ->middleware('throttle:admin-actions')
            ->name('inquiries.restore');

        Route::get('/study-requests', [StudyRequestController::class, 'index'])->name('study-requests.index');
        Route::get('/study-requests/{studyRequest}', [StudyRequestController::class, 'show'])
            ->withTrashed()
            ->name('study-requests.show');
        Route::patch('/study-requests/{studyRequest}', [StudyRequestController::class, 'update'])
            ->middleware('throttle:admin-actions')
            ->name('study-requests.update');
        Route::delete('/study-requests/{studyRequest}', [StudyRequestController::class, 'destroy'])
            ->middleware('throttle:admin-actions')
            ->name('study-requests.destroy');
        Route::patch('/study-requests/{studyRequest}/restore', [StudyRequestController::class, 'restore'])
            ->withTrashed()
            ->middleware('throttle:admin-actions')
            ->name('study-requests.restore');
    });

require __DIR__.'/settings.php';
