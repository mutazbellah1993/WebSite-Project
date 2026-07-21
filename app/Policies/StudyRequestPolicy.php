<?php

namespace App\Policies;

use App\Models\StudyRequest;
use App\Models\User;

class StudyRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessAdmin();
    }

    public function view(User $user, StudyRequest $studyRequest): bool
    {
        return $user->canAccessAdmin();
    }

    public function update(User $user, StudyRequest $studyRequest): bool
    {
        return $user->canManageLeads();
    }

    public function delete(User $user, StudyRequest $studyRequest): bool
    {
        return $user->canManageLeads();
    }

    public function restore(User $user, StudyRequest $studyRequest): bool
    {
        return $user->canManageLeads();
    }
}
