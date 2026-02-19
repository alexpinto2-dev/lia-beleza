import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        client_name,
        service_name,
        professional_name,
        appointment_time,
        status
      `)
      .order('appointment_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json({ error: 'Falha ao carregar agendamentos' }, { status: 500 });
  }
}
