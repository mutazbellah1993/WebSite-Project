<?php

namespace App\Providers;

use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Laravel\Passkeys\Contracts\PasskeyUser;
use Laravel\Passkeys\Passkey;
use Laravel\Passkeys\Passkeys;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LoginResponseContract::class, fn () => new class implements LoginResponseContract
        {
            public function toResponse($request)
            {
                return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->intended(route('admin.dashboard', absolute: false));
            }
        });

        $this->app->singleton(LogoutResponseContract::class, fn () => new class implements LogoutResponseContract
        {
            public function toResponse($request)
            {
                return $request->wantsJson()
                    ? response()->json(null, 204)
                    : redirect()->route('login');
            }
        });

        $this->app->singleton(TwoFactorLoginResponseContract::class, fn () => new class implements TwoFactorLoginResponseContract
        {
            public function toResponse($request)
            {
                $user = $request->user();

                if ($user instanceof User && ! $user->is_active) {
                    Auth::guard(config('fortify.guard'))->logout();

                    if ($request->hasSession()) {
                        $request->session()->invalidate();
                        $request->session()->regenerateToken();
                    }

                    return $request->wantsJson()
                        ? response()->json(['message' => trans('auth.failed')], 403)
                        : redirect()->route('login')->withErrors([
                            Fortify::username() => trans('auth.failed'),
                        ]);
                }

                return $request->wantsJson()
                    ? response()->json(null, 204)
                    : redirect()->intended(route('admin.dashboard', absolute: false));
            }
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RedirectIfAuthenticated::redirectUsing(fn (Request $request): string => route('admin.dashboard'));

        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        Fortify::authenticateUsing(function (Request $request): ?User {
            $password = (string) $request->input('password');
            $user = User::where('email', $request->input(Fortify::username()))->first();

            if (! $user || ! Hash::check($password, $user->password) || ! $user->is_active) {
                return null;
            }

            if (config('hashing.rehash_on_login', true) && Hash::needsRehash($user->password)) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }

            return $user;
        });

        Passkeys::authorizeLoginUsing(
            fn (Request $request, PasskeyUser $user, Passkey $passkey): bool => $user instanceof User && $user->is_active,
        );
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
