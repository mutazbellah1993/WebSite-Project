<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title_en',
    'title_ar',
    'description_en',
    'description_ar',
    'icon',
    'sort_order',
    'is_active',
])]
class MethodologyStep extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
