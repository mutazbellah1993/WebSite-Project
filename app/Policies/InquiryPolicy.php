<?php

namespace App\Policies;

use App\Models\Inquiry;
use App\Models\User;

class InquiryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessAdmin();
    }

    public function view(User $user, Inquiry $inquiry): bool
    {
        return $user->canAccessAdmin();
    }

    public function update(User $user, Inquiry $inquiry): bool
    {
        return $user->canManageLeads();
    }

    public function delete(User $user, Inquiry $inquiry): bool
    {
        return $user->canManageLeads();
    }

    public function restore(User $user, Inquiry $inquiry): bool
    {
        return $user->canManageLeads();
    }
}
