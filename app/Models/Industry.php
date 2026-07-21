<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'slug',
    'title_en',
    'title_ar',
    'description_en',
    'description_ar',
    'icon',
    'image_path',
    'status',
    'sort_order',
])]
class Industry extends Model
{
    use SoftDeletes;

    public const STATUSES = ['draft', 'published', 'archived'];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * @param  Builder<Industry>  $query
     * @return Builder<Industry>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    /**
     * @return HasMany<CaseStudy, $this>
     */
    public function caseStudies(): HasMany
    {
        return $this->hasMany(CaseStudy::class);
    }
}
