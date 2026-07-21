<?php

namespace App\Http\Requests\Admin;

use App\Models\Service;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $service = $this->route('service');

        return $service instanceof Service && ($this->user()?->can('update', $service) ?? false);
    }

    protected function prepareForValidation(): void
    {
        $service = $this->route('service');
        $slug = filled($this->input('slug'))
            ? Str::slug((string) $this->input('slug'))
            : ($service instanceof Service ? $service->slug : Str::slug((string) $this->input('title_en')));

        $this->merge([
            'slug' => $slug,
            'is_featured' => $this->boolean('is_featured'),
            'sort_order' => $this->input('sort_order', 0),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Service|null $service */
        $service = $this->route('service');

        return [
            'title_en' => ['required', 'string', 'max:160'],
            'title_ar' => ['required', 'string', 'max:160'],
            'slug' => [
                'required',
                'string',
                'max:180',
                'alpha_dash',
                Rule::unique('services', 'slug')->ignore($service?->id),
            ],
            'short_description_en' => ['nullable', 'string', 'max:1000'],
            'short_description_ar' => ['nullable', 'string', 'max:1000'],
            'description_en' => ['nullable', 'string', 'max:10000'],
            'description_ar' => ['nullable', 'string', 'max:10000'],
            'icon' => ['nullable', 'string', 'max:80', 'regex:/^[A-Za-z0-9_-]+$/'],
            'image_path' => ['nullable', 'string', 'max:255', 'not_regex:/\.\./', 'regex:/^[A-Za-z0-9\/._ -]+$/'],
            'status' => ['required', 'string', Rule::in(Service::STATUSES)],
            'is_featured' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'seo_title_en' => ['nullable', 'string', 'max:180'],
            'seo_title_ar' => ['nullable', 'string', 'max:180'],
            'seo_description_en' => ['nullable', 'string', 'max:320'],
            'seo_description_ar' => ['nullable', 'string', 'max:320'],
        ];
    }
}
