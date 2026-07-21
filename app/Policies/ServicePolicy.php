<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessAdmin();
    }

    public function view(User $user, Service $service): bool
    {
        return $user->canAccessAdmin();
    }

    public function create(User $user): bool
    {
        return $user->canManageContent();
    }

    public function update(User $user, Service $service): bool
    {
        return $user->canManageContent();
    }

    public function delete(User $user, Service $service): bool
    {
        return $user->canManageContent();
    }

    public function restore(User $user, Service $service): bool
    {
        return $user->canManageContent();
    }
}
