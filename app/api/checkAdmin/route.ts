
import { NextResponse } from 'next/server';
import User from '../models/userModel';

export async function GET() {
  const adminExists = await User.findOne({ where: { role: 'admin' } });
  console.log('test:', adminExists)
  return NextResponse.json({ adminExists: !!adminExists });
}
