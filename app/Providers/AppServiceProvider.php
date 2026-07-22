<?php

namespace App\Providers;

use App\Models\ContentCategory;
use App\Models\Inquiry;
use App\Models\Industry;
use App\Models\Insight;
use App\Models\StudyRequest;
use App\Models\Service;
use App\Policies\ContentCategoryPolicy;
use App\Policies\InquiryPolicy;
use App\Policies\IndustryPolicy;
use App\Policies\InsightPolicy;
use App\Policies\StudyRequestPolicy;
use App\Policies\ServicePolicy;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        Gate::policy(Inquiry::class, InquiryPolicy::class);
        Gate::policy(StudyRequest::class, StudyRequestPolicy::class);
        Gate::policy(Service::class, ServicePolicy::class);
        Gate::policy(Industry::class, IndustryPolicy::class);
        Gate::policy(ContentCategory::class, ContentCategoryPolicy::class);
        Gate::policy(Insight::class, InsightPolicy::class);

        RateLimiter::for('admin-actions', function (Request $request) {
            return Limit::perMinute(90)->by((string) ($request->user()?->id ?? $request->ip()));
        });

        RateLimiter::for('public-leads', function (Request $request) {
            return Limit::perMinute(12)->by((string) $request->ip());
        });

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
