<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name_en',
    'name_ar',
    'position_en',
    'position_ar',
    'bio_en',
    'bio_ar',
    'photo_path',
    'email',
    'linkedin_url',
    'sort_order',
    'is_active',
])]
class TeamMember extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
