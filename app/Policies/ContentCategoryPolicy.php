<?php

namespace App\Policies;

use App\Models\ContentCategory;
use App\Models\User;

class ContentCategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAccessAdmin();
    }

    public function view(User $user, ContentCategory $contentCategory): bool
    {
        return $user->canAccessAdmin();
    }

    public function create(User $user): bool
    {
        return $user->canManageContent();
    }

    public function update(User $user, ContentCategory $contentCategory): bool
    {
        return $user->canManageContent();
    }

    public function delete(User $user, ContentCategory $contentCategory): bool
    {
        return $user->canManageContent();
    }
}
