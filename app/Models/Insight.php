<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'author_id',
    'type',
    'slug',
    'title_en',
    'title_ar',
    'excerpt_en',
    'excerpt_ar',
    'body_en',
    'body_ar',
    'cover_image_path',
    'attachment_path',
    'is_featured',
    'status',
    'published_at',
    'seo_title_en',
    'seo_title_ar',
    'seo_description_en',
    'seo_description_ar',
])]
class Insight extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return BelongsToMany<ContentCategory, $this>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ContentCategory::class);
    }
}
