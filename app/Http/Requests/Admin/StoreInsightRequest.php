<?php

namespace App\Http\Requests\Admin;

use App\Models\Insight;
use App\Support\SafeHtml;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreInsightRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Insight::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $slugSource = filled($this->input('slug'))
            ? (string) $this->input('slug')
            : (string) $this->input('title_en');

        $this->merge([
            'slug' => Str::slug($slugSource),
            'excerpt_en' => $this->plainText('excerpt_en'),
            'excerpt_ar' => $this->plainText('excerpt_ar'),
            'body_en' => SafeHtml::sanitize($this->input('body_en')),
            'body_ar' => SafeHtml::sanitize($this->input('body_ar')),
            'is_featured' => $this->boolean('is_featured'),
            'published_at' => filled($this->input('published_at')) ? $this->input('published_at') : null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(Insight::TYPES)],
            'title_en' => ['required', 'string', 'max:200'],
            'title_ar' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:180', 'alpha_dash', Rule::unique('insights', 'slug')],
            'excerpt_en' => ['nullable', 'string', 'max:1000'],
            'excerpt_ar' => ['nullable', 'string', 'max:1000'],
            'body_en' => ['nullable', 'string', 'max:50000'],
            'body_ar' => ['nullable', 'string', 'max:50000'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['integer', 'distinct', Rule::exists('content_categories', 'id')],
            'cover_image' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:5120',
            ],
            'report_attachment' => [
                'nullable',
                'file',
                'mimes:pdf',
                'mimetypes:application/pdf',
                'max:20480',
            ],
            'is_featured' => ['required', 'boolean'],
            'status' => ['required', 'string', Rule::in(Insight::STATUSES)],
            'published_at' => ['nullable', 'date'],
            'seo_title_en' => ['nullable', 'string', 'max:180'],
            'seo_title_ar' => ['nullable', 'string', 'max:180'],
            'seo_description_en' => ['nullable', 'string', 'max:320'],
            'seo_description_ar' => ['nullable', 'string', 'max:320'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($this->input('status') !== 'published') {
                    return;
                }

                foreach (['excerpt_en', 'excerpt_ar', 'body_en', 'body_ar'] as $field) {
                    if (! filled($this->input($field))) {
                        $validator->errors()->add($field, __('Published content requires this field.'));
                    }
                }
            },
        ];
    }

    private function plainText(string $field): ?string
    {
        $value = trim(strip_tags((string) $this->input($field, '')));

        return $value !== '' ? $value : null;
    }
}
