<?php

namespace App\Http\Requests\Admin;

use App\Models\Industry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateIndustryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $industry = $this->route('industry');

        return $industry instanceof Industry && ($this->user()?->can('update', $industry) ?? false);
    }

    protected function prepareForValidation(): void
    {
        $industry = $this->route('industry');
        $slug = filled($this->input('slug'))
            ? Str::slug((string) $this->input('slug'))
            : ($industry instanceof Industry ? $industry->slug : Str::slug((string) $this->input('title_en')));

        $this->merge([
            'slug' => $slug,
            'sort_order' => $this->input('sort_order', 0),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Industry|null $industry */
        $industry = $this->route('industry');

        return [
            'title_en' => ['required', 'string', 'max:160'],
            'title_ar' => ['required', 'string', 'max:160'],
            'slug' => [
                'required',
                'string',
                'max:180',
                'alpha_dash',
                Rule::unique('industries', 'slug')->ignore($industry?->id),
            ],
            'description_en' => ['nullable', 'string', 'max:10000'],
            'description_ar' => ['nullable', 'string', 'max:10000'],
            'icon' => ['nullable', 'string', 'max:80', 'regex:/^[A-Za-z0-9_-]+$/'],
            'image_path' => ['nullable', 'string', 'max:255', 'not_regex:/\.\./', 'regex:/^[A-Za-z0-9\/._ -]+$/'],
            'status' => ['required', 'string', Rule::in(Industry::STATUSES)],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
