<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
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

    /**
     * @return HasMany<CaseStudy, $this>
     */
    public function caseStudies(): HasMany
    {
        return $this->hasMany(CaseStudy::class);
    }
}
