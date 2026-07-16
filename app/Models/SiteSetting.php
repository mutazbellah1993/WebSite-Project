<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'group',
    'key',
    'type',
    'value',
    'is_public',
])]
class SiteSetting extends Model
{
    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }
}
