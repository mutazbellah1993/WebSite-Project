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
            'full_name' => ['required', 'string', 'max:140'],
            'email' => ['required', 'email:rfc', 'max:180'],
            'phone' => ['nullable', 'string', 'max:30'],
            'organization' => ['nullable', 'string', 'max:180'],
            'job_title' => ['nullable', 'string', 'max:180'],
            'client_type' => ['required', 'string', 'in:business,ngo,government,university,researcher,individual,other'],
            'service_type' => ['required', 'string', 'max:180'],
            'study_title' => ['nullable', 'string', 'max:180'],
            'project_description' => ['required', 'string', 'min:20', 'max:5000'],
            'objectives' => ['nullable', 'string', 'max:5000'],
            'target_population' => ['nullable', 'string', 'max:3000'],
            'geographic_scope' => ['nullable', 'string', 'max:1000'],
            'desired_start_date' => ['nullable', 'date'],
            'desired_end_date' => ['nullable', 'date', 'after_or_equal:desired_start_date'],
            'consent' => ['accepted'],
            'website' => ['prohibited'],
        ];
    }
}
