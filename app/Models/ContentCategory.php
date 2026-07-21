<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'slug',
    'name_en',
    'name_ar',
    'description_en',
    'description_ar',
])]
class ContentCategory extends Model
{
    /**
     * @return BelongsToMany<Insight, $this>
     */
    public function insights(): BelongsToMany
    {
        return $this->belongsToMany(Insight::class);
    }

    /**
     * @param  Builder<ContentCategory>  $query
     * @return Builder<ContentCategory>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('name_en')->orderBy('name_ar');
    }
}
