<?php

use App\Http\Controllers\PublicInquiryController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'public/home')->name('home');
Route::inertia('/about-us', 'public/about')->name('about');
Route::inertia('/services', 'public/services')->name('services');
Route::inertia('/industries', 'public/industries')->name('industries');
Route::inertia('/research-and-insights', 'public/insights')->name('insights');
Route::inertia('/request-a-study', 'public/request-study')->name('request-study');
Route::post('/request-a-study', [PublicInquiryController::class, 'storeStudyRequest'])->name('request-study.submit');
Route::inertia('/contact-us', 'public/contact')->name('contact');
Route::post('/contact-us', [PublicInquiryController::class, 'storeContactMessage'])->name('contact.submit');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
