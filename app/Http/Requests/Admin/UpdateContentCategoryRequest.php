<?php

namespace App\Http\Requests\Admin;

use App\Models\ContentCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateContentCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $category = $this->route('contentCategory');

        return $category instanceof ContentCategory && ($this->user()?->can('update', $category) ?? false);
    }

    protected function prepareForValidation(): void
    {
        $category = $this->route('contentCategory');
        $slug = filled($this->input('slug'))
            ? Str::slug((string) $this->input('slug'))
            : ($category instanceof ContentCategory ? $category->slug : Str::slug((string) $this->input('name_en')));

        $this->merge([
            'slug' => $slug,
            'description_en' => $this->cleanText('description_en'),
            'description_ar' => $this->cleanText('description_ar'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var ContentCategory|null $category */
        $category = $this->route('contentCategory');

        return [
            'name_en' => ['required', 'string', 'max:160'],
            'name_ar' => ['required', 'string', 'max:160'],
            'slug' => [
                'required',
                'string',
                'max:180',
                'alpha_dash',
                Rule::unique('content_categories', 'slug')->ignore($category?->id),
            ],
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
