<?php

namespace App\Notifications;

use App\Models\Inquiry;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PublicInquiryReceived extends Notification
{
    public function __construct(private readonly Inquiry $inquiry) {}

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
            ->subject('New EliteData contact inquiry')
            ->greeting('New contact inquiry')
            ->line("Name: {$this->inquiry->name}")
            ->line("Email: {$this->inquiry->email}")
            ->line('Phone: '.($this->inquiry->phone ?: 'Not provided'))
            ->line('Organization: '.($this->inquiry->organization ?: 'Not provided'))
            ->line('Subject: '.($this->inquiry->subject ?: 'Not provided'))
            ->line('Message:')
            ->line($this->inquiry->message)
            ->action('Open admin dashboard', route('admin.inquiries.show', $this->inquiry))
            ->line('This notification contains only public form fields.');
    }
}
