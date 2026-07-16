<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'slug',
    'title_en',
    'title_ar',
    'excerpt_en',
    'excerpt_ar',
    'body_en',
    'body_ar',
    'template',
    'status',
    'published_at',
    'sort_order',
    'seo_title_en',
    'seo_title_ar',
    'seo_description_en',
    'seo_description_ar',
    'og_image_path',
])]
class Page extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
