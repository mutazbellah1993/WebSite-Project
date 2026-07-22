<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ContentCategoryController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\IndustryController;
use App\Http\Controllers\Admin\InsightController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\StudyRequestController;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\PublicContentController;
use App\Http\Controllers\PublicInsightController;
use App\Http\Controllers\PublicLeadController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/robots.txt', RobotsController::class)->name('robots');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/', [PublicContentController::class, 'home'])->name('home');
Route::inertia('/about-us', 'public/about')->name('about');
Route::get('/services', [PublicContentController::class, 'services'])->name('services');
Route::get('/industries', [PublicContentController::class, 'industries'])->name('industries');
Route::get('/research-and-insights', [PublicInsightController::class, 'index'])->name('insights');
Route::get('/research-and-insights/{insight:slug}/download', [PublicInsightController::class, 'download'])->name('insights.download');
Route::get('/research-and-insights/{insight:slug}', [PublicInsightController::class, 'show'])->name('insights.show');
Route::inertia('/request-a-study', 'public/request-study')->name('request-study');
Route::post('/request-a-study', [PublicLeadController::class, 'storeStudyRequest'])
    ->middleware('throttle:public-leads')
    ->name('request-study.submit');
Route::inertia('/contact-us', 'public/contact')->name('contact');
Route::post('/contact-us', [PublicLeadController::class, 'storeContactMessage'])
    ->middleware('throttle:public-leads')
    ->name('contact.submit');
Route::inertia('/privacy-policy', 'public/privacy')->name('privacy');
Route::inertia('/terms-of-use', 'public/terms')->name('terms');

Route::middleware(['auth', 'verified', 'admin.access'])->group(function () {
    Route::get('dashboard', DashboardRedirectController::class)->name('dashboard');
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

        Route::get('/content-categories', [ContentCategoryController::class, 'index'])->name('content-categories.index');
        Route::get('/content-categories/create', [ContentCategoryController::class, 'create'])->name('content-categories.create');
        Route::post('/content-categories', [ContentCategoryController::class, 'store'])
            ->middleware('throttle:admin-actions')
            ->name('content-categories.store');
        Route::get('/content-categories/{contentCategory}/edit', [ContentCategoryController::class, 'edit'])
            ->name('content-categories.edit');
        Route::patch('/content-categories/{contentCategory}', [ContentCategoryController::class, 'update'])
            ->middleware('throttle:admin-actions')
            ->name('content-categories.update');
        Route::delete('/content-categories/{contentCategory}', [ContentCategoryController::class, 'destroy'])
            ->middleware('throttle:admin-actions')
            ->name('content-categories.destroy');

        Route::get('/insights', [InsightController::class, 'index'])->name('insights.index');
        Route::get('/insights/create', [InsightController::class, 'create'])->name('insights.create');
        Route::post('/insights', [InsightController::class, 'store'])
            ->middleware('throttle:admin-actions')
            ->name('insights.store');
        Route::get('/insights/{insight}/edit', [InsightController::class, 'edit'])
            ->withTrashed()
            ->name('insights.edit');
        Route::get('/insights/{insight}/preview', [InsightController::class, 'preview'])
            ->name('insights.preview');
        Route::patch('/insights/{insight}', [InsightController::class, 'update'])
            ->middleware('throttle:admin-actions')
            ->name('insights.update');
        Route::delete('/insights/{insight}', [InsightController::class, 'destroy'])
            ->middleware('throttle:admin-actions')
            ->name('insights.destroy');
        Route::patch('/insights/{insight}/restore', [InsightController::class, 'restore'])
            ->withTrashed()
            ->middleware('throttle:admin-actions')
            ->name('insights.restore');

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
