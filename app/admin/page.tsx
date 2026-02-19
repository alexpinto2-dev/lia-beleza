'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';

type Appointment = {
  id: string;
  client_name: string;
  service_name: string;
  professional_name: string;
  appointment_time: string;
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const todayAppointments = appointments.filter(a => 
    new Date(a.appointment_time).toDateString() === new Date().toDateString()
  );

  const totalToday = todayAppointments.length;
  const faturamentoHoje = todayAppointments.length * 95; // média estimada

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Bem-vindo de volta, Admin!</h1>
            <p className="text-gray-600 mt-1">Quinta-feira, 19 de fevereiro de 2026</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Salão Beleza Chic • Aracaju/SE</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalToday}</p>
                <p className="text-sm text-gray-600">Agendamentos hoje</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">R$ {faturamentoHoje}</p>
                <p className="text-sm text-gray-600">Faturamento estimado hoje</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">4</p>
                <p className="text-sm text-gray-600">Funcionários ativos</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">82%</p>
                <p className="text-sm text-gray-600">Taxa de ocupação</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agenda de Hoje */}
        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Agenda de Hoje</h2>
            <button className="bg-pink-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-pink-700 transition">
              + Novo Agendamento
            </button>
          </div>

          {loading ? (
            <p className="text-center py-12 text-gray-500">Carregando agenda...</p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-center py-12 text-gray-500">Nenhum agendamento hoje ainda.</p>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((app) => (
                <div key={app.id} className="flex items-center justify-between bg-zinc-50 p-6 rounded-2xl border border-pink-100">
                  <div className="flex items-center gap-6">
                    <div className="text-5xl">💇🏻‍♀️</div>
                    <div>
                      <p className="font-semibold text-xl">{app.client_name}</p>
                      <p className="text-pink-600 font-medium">{app.service_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-800">
                      {new Date(app.appointment_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500">com {app.professional_name}</p>
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
