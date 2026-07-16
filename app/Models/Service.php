<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'slug',
    'title_en',
    'title_ar',
    'short_description_en',
    'short_description_ar',
    'description_en',
    'description_ar',
    'icon',
    'image_path',
    'is_featured',
    'status',
    'sort_order',
    'seo_title_en',
    'seo_title_ar',
    'seo_description_en',
    'seo_description_ar',
])]
class Service extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
        ];
    }
}
