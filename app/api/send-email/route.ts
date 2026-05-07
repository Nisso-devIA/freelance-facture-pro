import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/email'

const ALLOWED_ORIGINS = [
  'https://freelance-facture-pro.vercel.app',   // ton frontend prod
  'http://localhost:3000',
  'http://localhost:3001',
  // ajoute ici tous tes preview Vercel ou autres domaines si besoin
];

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app');

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Max-Age': '86400',           // 24h de cache preflight
  };

  if (isAllowed) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
    headers['Access-Control-Allow-Credentials'] = 'true'; // safe même si tu n’utilises pas encore
  }

  // 204 = preflight propre, pas de body inutile
  return new NextResponse(null, { status: 204, headers });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app');

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (isAllowed) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Vary'] = 'Origin';
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  }

  try {
    const body = await req.json();

    await sendInvoiceEmail({
      to: body.to,
      clientName: body.clientName,
      invoiceNumber: body.invoiceNumber,
      amount: body.amount,
      pdfUrl: body.pdfUrl,
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });

  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}