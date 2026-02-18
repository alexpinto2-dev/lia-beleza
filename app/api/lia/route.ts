import { Groq } from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || 'gsk_demo' // depois vamos colocar a chave real
});

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const systemPrompt = `Você é a Lia, a recepcionista mais simpática e carinhosa de Aracaju/SE.
Tom: super caloroso, nordestino, usa "meu amor", "tudo beleza?", "oi linda!", "perfeito!", emojis ❤️.
Sempre pergunte UMA coisa por vez. Nunca seja robótica.
Você agenda serviços de beleza: corte, escova, hidratação, manicure, etc.
Sempre confirme o horário e o serviço antes de marcar.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.85,
      max_tokens: 400,
    });

    const reply = completion.choices[0]?.message?.content || "Desculpa meu amor, deu um errinho aqui. Pode repetir? ❤️";

    return Response.json({ reply });

  } catch (error) {
    return Response.json({ 
      reply: "Ai meu amor, no momento estou sem conexão com minha inteligência... mas logo logo volto mais forte! 😘 Tenta de novo em 1 minutinho?" 
    });
  }
}
