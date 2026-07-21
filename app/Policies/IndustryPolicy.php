<?php

namespace App\Policies;

use App\Models\Industry;
use App\Models\User;

class IndustryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessAdmin();
    }

    public function view(User $user, Industry $industry): bool
    {
        return $user->canAccessAdmin();
    }

    public function create(User $user): bool
    {
        return $user->canManageContent();
    }

    public function update(User $user, Industry $industry): bool
    {
        return $user->canManageContent();
    }

    public function delete(User $user, Industry $industry): bool
    {
        return $user->canManageContent();
    }

    public function restore(User $user, Industry $industry): bool
    {
        return $user->canManageContent();
    }
}
