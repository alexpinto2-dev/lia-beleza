'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';

type Appointment = {
  id: string;
  client_name: string;
  service_name: string;
  professional_name: string;
  appointment_time: string;
  status: string;
};

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-pink-600">Agenda do Salão</h1>
            <p className="text-gray-600">Aracaju/SE • Hoje é {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          <a href="/" className="text-pink-600 hover:underline">Voltar para o chat com a Lia</a>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-pink-600" />
            <h2 className="text-2xl font-semibold">Agendamentos de hoje</h2>
          </div>

          {loading ? (
            <p>Carregando agenda...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Nenhum agendamento ainda. A Lia já está trabalhando para lotar! 💖</p>
          ) : (
            <div className="space-y-4">
              {appointments.map(app => (
                <div key={app.id} className="flex items-center justify-between bg-zinc-50 p-6 rounded-2xl border border-pink-100">
                  <div className="flex items-center gap-6">
                    <div className="text-4xl">💇🏻‍♀️</div>
                    <div>
                      <p className="font-semibold text-xl">{app.client_name}</p>
                      <p className="text-pink-600">{app.service_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-2 justify-end text-lg font-medium">
                      <Clock className="w-5 h-5" /> {new Date(app.appointment_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                      <User className="w-4 h-4" /> {app.professional_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
