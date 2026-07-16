<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'client_name',
    'client_position',
    'organization',
    'quote_en',
    'quote_ar',
    'photo_path',
    'is_approved',
    'sort_order',
])]
class Testimonial extends Model
{
    protected function casts(): array
    {
        return [
            'is_approved' => 'boolean',
        ];
    }
}
