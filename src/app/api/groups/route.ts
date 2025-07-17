// src/app/api/groups/route.ts
import { NextResponse } from 'next/server';
import { getGroups } from '@/lib/api';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
  noStore();
  try {
    const groups = await getGroups();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('API Error fetching groups:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
