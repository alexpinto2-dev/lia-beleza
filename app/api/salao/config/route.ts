import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const tenantId = request.headers.get('x-tenant-id'); // vamos passar isso depois

  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant não identificado' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('tenants')
    .select('name, logo_url, primary_color, secondary_color, whatsapp_number')
    .eq('id', tenantId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Config não encontrada' }, { status: 404 });
  }

  return NextResponse.json(data);
}
