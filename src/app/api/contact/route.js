import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation/schemas';
import { createMessage } from '@/lib/db/repositories/messagesRepo';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

export async function POST(request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`contact_${ip}`, 5, 60 * 60 * 1000); // 5 per hour

  if (!rateLimit.allowed) {
    const minutesLeft = Math.ceil(rateLimit.resetMs / 60000);
    return NextResponse.json(
      { error: `Too many submissions from this connection. Please try again in ${minutesLeft} minutes.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Anti-spam Honeypot Check: if hidden field is filled, silently discard spam
    if (body.honeypot || body.website) {
      return NextResponse.json({
        success: true,
        messageId: 'honeypot_filtered',
        whatsappUrl: null
      });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid form input.' },
        { status: 400 }
      );
    }

    const { name, email, projectType, budget, message } = parsed.data;

    // 1. Store securely in MongoDB
    const storedMsg = await createMessage({
      name,
      email,
      projectType,
      budget,
      message,
      ip
    });

    // 2. Format WhatsApp fallback URL using environment variables
    const whatsappNumber = (process.env.WHATSAPP_NUMBER || '918360825752').replace(/\D/g, '');
    const whatsappMessage = 
      `*New Project Inquiry from Portfolio*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `🛠 *Project Type:* ${projectType}\n` +
      `💰 *Budget Range:* ${budget}\n\n` +
      `📝 *Message:*\n${message}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // 3. Optional async forward to FormSubmit for instant email notifications using environment variable
    const targetEmail = process.env.CONTACT_EMAIL || 'contact@mayurarora.dev';
    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          "Project Type": projectType,
          "Budget Range": budget,
          Message: message,
          _subject: `New Project Inquiry from ${name} - Portfolio CMS`,
          _template: "table",
          _captcha: "false"
        })
      }).catch(err => console.warn('[FormSubmit background warning]:', err.message));
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      messageId: storedMsg._id,
      whatsappUrl
    });
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your message.' },
      { status: 500 }
    );
  }
}
