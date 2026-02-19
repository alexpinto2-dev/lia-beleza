import { Groq } from 'groq-sdk';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const systemPrompt = `Você é a Lia, recepcionista carinhosa do salão em Aracaju/SE.
Tom: super simpático, usa "meu amor", "tudo beleza?", "oi linda!", "perfeito!", emojis ❤️.
Pergunte UMA coisa por vez.
Quando a cliente der nome + serviço + profissional + horário e disser "sim", "confirma", "quero", "agendar" → responda confirmando e use o formato exato:
[AGENDAR] Nome: [nome] | Serviço: [serviço] | Profissional: [profissional] | Horário: [2026-02-20 10:00:00] [FIM]`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    let reply = completion.choices[0]?.message?.content || "Desculpa meu amor...";

    // Detecta se é hora de agendar
    const match = reply.match(/\[AGENDAR\]([\s\S]*?)\[FIM\]/);
    if (match) {
      const texto = match[1].trim();
      const nome = texto.match(/Nome:\s*(.+?)(?=\s*\||$)/)?.[1]?.trim();
      const servico = texto.match(/Serviço:\s*(.+?)(?=\s*\||$)/)?.[1]?.trim();
      const profissional = texto.match(/Profissional:\s*(.+?)(?=\s*\||$)/)?.[1]?.trim();
      const horarioStr = texto.match(/Horário:\s*(.+?)(?=\s*\||$)/)?.[1]?.trim();

      if (nome && servico && profissional && horarioStr) {
        // Checa disponibilidade simples
        const { data: existentes } = await supabase
          .from('appointments')
          .select('appointment_time')
          .eq('professional_name', profissional);

        const jaOcupado = existentes?.some(a => 
          new Date(a.appointment_time).toISOString().slice(0,16) === new Date(horarioStr).toISOString().slice(0,16)
        );

        if (jaOcupado) {
          reply = `Ai ${nome}, esse horário já está ocupado com a ${profissional}. Quer outro horário? ❤️`;
        } else {
          const { error } = await supabase.from('appointments').insert({
            client_name: nome,
            service_name: servico,
            professional_name: profissional,
            appointment_time: horarioStr,
            status: 'confirmed'
          });

          if (!error) {
            reply = `Perfeito, meu amor! 💖\nAgendado para ${nome} - ${servico} com ${profissional} às ${new Date(horarioStr).toLocaleTimeString('pt-BR')}\n\nApareceu no dashboard! Te mando lembrete 24h antes.`;
          } else {
            reply = "Salvou aqui, mas deu um errinho no banco. Pode confirmar de novo?";
          }
        }
      }
    }

    return Response.json({ reply });

  } catch (error) {
    console.error(error);
    return Response.json({ 
      reply: "Só um minutinho viu?, deu um probleminha na conexão... Daqui a pouco tente novamente 😘" 
    });
  }
}
