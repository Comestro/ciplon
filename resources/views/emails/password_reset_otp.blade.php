<x-mail::message>
# Password Reset Request

Hello {{ $userName }},

We received a request to reset the password for your **{{ config('app.name', 'Ciplon Pharma') }}** account.

Use the verification code below to complete your password reset:

<x-mail::panel>
<div style="text-align: center; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4f46e5; padding: 10px 0;">
{{ $otp }}
</div>
</x-mail::panel>

> **Note:** This verification code is valid for **10 minutes**. For your security, do not share this code with anyone.

If you did not request a password reset, please disregard this email. Your account remains secure.

Thanks,<br>
**{{ config('app.name', 'Ciplon Pharma') }} Security Team**
</x-mail::message>
