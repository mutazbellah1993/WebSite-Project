<?php

namespace App\Http\Requests\Admin;

use App\Models\ContentCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreContentCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', ContentCategory::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $slugSource = filled($this->input('slug'))
            ? (string) $this->input('slug')
            : (string) $this->input('name_en');

        $this->merge([
            'slug' => Str::slug($slugSource),
            'description_en' => $this->cleanText('description_en'),
            'description_ar' => $this->cleanText('description_ar'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name_en' => ['required', 'string', 'max:160'],
            'name_ar' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:180', 'alpha_dash', Rule::unique('content_categories', 'slug')],
            'description_en' => ['nullable', 'string', 'max:1000'],
            'description_ar' => ['nullable', 'string', 'max:1000'],
        ];
    }

    private function cleanText(string $field): ?string
    {
        $value = trim(strip_tags((string) $this->input($field, '')));

        return $value !== '' ? $value : null;
    }
}
