<?php

namespace App\Http\Requests\Admin;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('inquiry')) ?? false;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(Inquiry::STATUSES)],
            'assigned_to' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query
                    ->where('is_active', true)
                    ->whereIn('role', User::LEAD_MANAGER_ROLES)),
            ],
            'internal_notes' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
