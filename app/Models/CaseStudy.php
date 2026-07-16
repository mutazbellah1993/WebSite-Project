<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'industry_id',
    'slug',
    'client_name',
    'is_client_public',
    'title_en',
    'title_ar',
    'summary_en',
    'summary_ar',
    'challenge_en',
    'challenge_ar',
    'methodology_en',
    'methodology_ar',
    'solution_en',
    'solution_ar',
    'results_en',
    'results_ar',
    'featured_image_path',
    'completion_date',
    'is_featured',
    'status',
    'published_at',
    'seo_title_en',
    'seo_title_ar',
    'seo_description_en',
    'seo_description_ar',
])]
class CaseStudy extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'is_client_public' => 'boolean',
            'is_featured' => 'boolean',
            'completion_date' => 'date',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Industry, $this>
     */
    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }
}
