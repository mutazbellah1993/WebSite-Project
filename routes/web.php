<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\IndustryController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\StudyRequestController;
use App\Http\Controllers\PublicContentController;
use App\Http\Controllers\PublicLeadController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicContentController::class, 'home'])->name('home');
Route::inertia('/about-us', 'public/about')->name('about');
Route::get('/services', [PublicContentController::class, 'services'])->name('services');
Route::get('/industries', [PublicContentController::class, 'industries'])->name('industries');
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

        Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
        Route::get('/services/create', [ServiceController::class, 'create'])->name('services.create');
        Route::post('/services', [ServiceController::class, 'store'])
            ->middleware('throttle:admin-actions')
            ->name('services.store');
        Route::get('/services/{service}/edit', [ServiceController::class, 'edit'])
            ->withTrashed()
            ->name('services.edit');
        Route::patch('/services/{service}', [ServiceController::class, 'update'])
            ->middleware('throttle:admin-actions')
            ->name('services.update');
        Route::delete('/services/{service}', [ServiceController::class, 'destroy'])
            ->middleware('throttle:admin-actions')
            ->name('services.destroy');
        Route::patch('/services/{service}/restore', [ServiceController::class, 'restore'])
            ->withTrashed()
            ->middleware('throttle:admin-actions')
            ->name('services.restore');

        Route::get('/industries', [IndustryController::class, 'index'])->name('industries.index');
        Route::get('/industries/create', [IndustryController::class, 'create'])->name('industries.create');
        Route::post('/industries', [IndustryController::class, 'store'])
            ->middleware('throttle:admin-actions')
            ->name('industries.store');
        Route::get('/industries/{industry}/edit', [IndustryController::class, 'edit'])
            ->withTrashed()
            ->name('industries.edit');
        Route::patch('/industries/{industry}', [IndustryController::class, 'update'])
            ->middleware('throttle:admin-actions')
            ->name('industries.update');
        Route::delete('/industries/{industry}', [IndustryController::class, 'destroy'])
            ->middleware('throttle:admin-actions')
            ->name('industries.destroy');
        Route::patch('/industries/{industry}/restore', [IndustryController::class, 'restore'])
            ->withTrashed()
            ->middleware('throttle:admin-actions')
            ->name('industries.restore');

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
