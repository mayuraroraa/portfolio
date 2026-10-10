import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { getAllMessages } from '@/lib/db/repositories/messagesRepo';

export async function GET() {
  try {
    await requireAdminSession();
    const messages = await getAllMessages();
    return NextResponse.json(messages);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to retrieve messages' }, { status: 500 });
  }
}
