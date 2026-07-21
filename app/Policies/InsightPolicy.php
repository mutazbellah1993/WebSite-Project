<?php

namespace App\Policies;

use App\Models\Insight;
use App\Models\User;

class InsightPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessAdmin();
    }

    public function view(User $user, Insight $insight): bool
    {
        return $user->canAccessAdmin();
    }

    public function create(User $user): bool
    {
        return $user->canManageContent();
    }

    public function update(User $user, Insight $insight): bool
    {
        return $user->canManageContent();
    }

    public function delete(User $user, Insight $insight): bool
    {
        return $user->canManageContent();
    }

    public function restore(User $user, Insight $insight): bool
    {
        return $user->canManageContent();
    }
}
