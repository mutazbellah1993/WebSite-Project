<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'organization' => ['required', 'string', 'max:180'],
            'name' => ['required', 'string', 'max:140'],
            'email' => ['required', 'email:rfc', 'max:180'],
            'phone' => ['nullable', 'string', 'max:80'],
            'sector' => ['required', 'string', 'max:140'],
            'service_interest' => ['required', 'string', 'max:180'],
            'timeline' => ['nullable', 'string', 'max:120'],
            'message' => ['required', 'string', 'min:20', 'max:4000'],
            'consent' => ['accepted'],
            'website' => ['prohibited'],
        ];
    }
}
