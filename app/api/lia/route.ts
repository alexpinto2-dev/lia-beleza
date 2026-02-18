import { Groq } from 'groq-sdk';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';  // novo import

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'gsk_demo' });

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const systemPrompt = `Você é a Lia, recepcionista simpática de salão em Aracaju/SE.
Tom: caloroso, nordestino-friendly: "meu amor", "tudo beleza?", "oi linda!", emojis ❤️.
Pergunte UMA coisa por vez.
Pergunte o nome da cliente e chame sempre pelo primeiro nome.
Quando o cliente confirmar nome, serviço, profissional e horário, responda confirmando e diga que salvou o agendamento.
Use formato simples para extrair dados quando confirmar: [AGENDAMENTO] Nome: ..., Serviço: ..., Profissional: ..., Horário: ... [FIM]`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
    });

    let reply = completion.choices[0]?.message?.content || "Desculpa meu amor, deu um errinho. Pode repetir? ❤️";

    // Lógica simples: se a resposta tiver [AGENDAMENTO] ... [FIM], tenta salvar
    const agendamentoMatch = reply.match(/\[AGENDAMENTO\]([\s\S]*?)\[FIM\]/);
    if (agendamentoMatch) {
      const dados = agendamentoMatch[1].trim();
      // Parse básico (melhorar depois com regex ou Zod)
      const nome = dados.match(/Nome: (.*)/)?.[1]?.trim();
      const servico = dados.match(/Serviço: (.*)/)?.[1]?.trim();
      const profissional = dados.match(/Profissional: (.*)/)?.[1]?.trim();
      const horario = dados.match(/Horário: (.*)/)?.[1]?.trim();

      if (nome && servico && profissional && horario) {
        // Salva no Supabase (por enquanto sem IDs reais – vamos assumir IDs fixos ou buscar depois)
        const { error } = await supabase.from('appointments').insert({
          // Para MVP: usar IDs fixos ou buscar por nome (melhorar depois)
          client_id: 'uuid-do-cliente-exemplo', // substitua depois
          professional_id: 'uuid-do-profissional-exemplo',
          service_id: 'uuid-do-servico-exemplo',
          appointment_time: new Date(horario).toISOString(),
          status: 'confirmed',
          notes: `Agendado via chat: ${servico} com ${profissional}`
        });

        if (!error) {
          reply += "\n\nAgendamento salvo com sucesso! Te mando lembrete 24h antes. 💖";
        } else {
          reply += "\n\nSalvou aqui, mas deu um probleminha no banco. Pode confirmar de novo?";
        }
      }
    }

    return Response.json({ reply });

  } catch (error) {
    console.error(error);
    return Response.json({ reply: "Ai meu amor, deu pau na conexão... Tenta mais tarde? 😘" });
  }
}
