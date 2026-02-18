'use client';

import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'lia', content: 'Oi meu amor! Tudo beleza? 😍 Quer agendar um horário hoje no salão?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/lia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg, history: messages }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: 'lia', content: data.reply || 'Desculpa meu amor, deu um probleminha aqui. Pode repetir?' }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl">💇🏻‍♀️</div>
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Lia Beleza</span>
          </div>
          <a href="#chat" className="font-medium text-pink-600 hover:underline">Conversar com a Lia</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 text-center px-6">
        <h1 className="text-6xl font-bold tracking-tighter mb-6">
          Sua recepcionista que <span className="text-pink-600">nunca tira folga</span>
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          Agendamentos por WhatsApp 24h com jeitinho de Aracaju ❤️
        </p>
        <a href="#chat" className="mt-10 inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-14 py-5 rounded-2xl text-xl font-semibold hover:scale-105 transition">
          Testar a Lia agora
        </a>
      </section>

      {/* Chat da Lia */}
      <section id="chat" className="max-w-2xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100">
          {/* Cabeçalho do chat */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-4xl">💇🏻‍♀️</div>
            <div>
              <p className="font-semibold text-xl">Lia Beleza • Aracaju/SE</p>
              <p className="text-sm opacity-90">Online agora • Responde em segundos</p>
            </div>
          </div>

          {/* Mensagens */}
          <div className="h-[420px] overflow-y-auto p-6 space-y-6 bg-zinc-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`chat-bubble ${m.role === 'user' ? 'client-bubble' : 'lia-bubble'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="lia-bubble">Lia está digitando... 💕</div>
            )}
          </div>

          {/* Caixa de digitar */}
          <div className="p-4 border-t bg-white flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite como se fosse sua cliente (ex: Quero marcar um corte)..."
              className="flex-1 border border-gray-300 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-500 text-lg"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white px-10 rounded-2xl font-medium"
            >
              Enviar
            </button>
          </div>
        </div>
      </section>

      <div className="text-center text-xs text-gray-500 pb-12">
        MVP criado com carinho por Grok para Alexandre • Aracaju/SE ❤️
      </div>
    </div>
  );
}
