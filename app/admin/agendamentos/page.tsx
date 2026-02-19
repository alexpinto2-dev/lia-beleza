'use client';

import { useEffect, useState } from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';

type Appointment = {
  id: string;
  client_name: string;
  service_name: string;
  professional_name: string;
  appointment_time: string;
  status: string;
};

export default function Agendamentos() {
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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Agendamentos</h1>
            <p className="text-gray-600">Gerencie todos os horários do salão</p>
          </div>
          <button 
            onClick={() => alert('Em breve: formulário para novo agendamento')}
            className="flex items-center gap-3 bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-pink-700 transition"
          >
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left p-6 font-medium text-gray-600">Cliente</th>
                <th className="text-left p-6 font-medium text-gray-600">Serviço</th>
                <th className="text-left p-6 font-medium text-gray-600">Profissional</th>
                <th className="text-left p-6 font-medium text-gray-600">Data e Hora</th>
                <th className="text-left p-6 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-500">Carregando agendamentos...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-500">Nenhum agendamento cadastrado ainda.</td></tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50 transition">
                    <td className="p-6 font-medium">{app.client_name}</td>
                    <td className="p-6 text-pink-600">{app.service_name}</td>
                    <td className="p-6">{app.professional_name}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.appointment_time).toLocaleDateString('pt-BR')}
                        <Clock className="w-4 h-4 ml-4" />
                        {new Date(app.appointment_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium">
                        {app.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
