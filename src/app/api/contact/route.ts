import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export async function POST(req: NextRequest) {
  try {
    const { name, company, email, message } = await req.json();

    // Basic server-side validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters).' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service is not configured. Please set RESEND_API_KEY.' },
        { status: 500 }
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || 'akshitkumardhaka99@gmail.com';
    // Use your verified domain in production (e.g. "Portfolio <contact@akshitkd.com>").
    // Falls back to Resend's shared testing sender for local development.
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company || 'N/A');
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New Portfolio Inquiry from ${name}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
          <h2 style="color:#0284c7; margin-bottom: 4px;">New Portfolio Inquiry</h2>
          <p style="color:#64748b; margin-top:0;">You received a new message from your portfolio contact form.</p>
          <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
            <tr>
              <td style="padding:8px 0; font-weight:600; width:120px;">Name</td>
              <td style="padding:8px 0;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600;">Company</td>
              <td style="padding:8px 0;">${safeCompany}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
          </table>
          <div style="background:#f1f5f9; border-radius:8px; padding:16px;">
            <p style="margin:0; white-space:pre-wrap;">${safeMessage}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend send error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
