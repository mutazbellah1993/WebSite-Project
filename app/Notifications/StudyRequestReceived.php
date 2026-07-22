<?php

namespace App\Notifications;

use App\Models\StudyRequest;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudyRequestReceived extends Notification
{
    public function __construct(private readonly StudyRequest $studyRequest) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New EliteData study request')
            ->greeting('New study request')
            ->line("Request number: {$this->studyRequest->request_number}")
            ->line("Name: {$this->studyRequest->full_name}")
            ->line("Email: {$this->studyRequest->email}")
            ->line('Phone: '.($this->studyRequest->phone ?: 'Not provided'))
            ->line('Organization: '.($this->studyRequest->organization ?: 'Not provided'))
            ->line('Client type: '.($this->studyRequest->client_type ?: 'Not provided'))
            ->line('Service type: '.($this->studyRequest->service_type ?: 'Not provided'))
            ->line('Study title: '.($this->studyRequest->study_title ?: 'Not provided'))
            ->line('Project description:')
            ->line($this->studyRequest->project_description)
            ->action('Open admin dashboard', route('admin.study-requests.show', $this->studyRequest))
            ->line('This notification contains only submitted public request fields.');
    }
}
