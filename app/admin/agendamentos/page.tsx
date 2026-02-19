'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Agendamento = {
  id: string;
  client_name: string;
  service_name: string;
  professional_name: string;
  appointment_time: string;
  status: string;
};

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Agendamento | null>(null);

  // Campos do formulário
  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [profissional, setProfissional] = useState('');
  const [dataHora, setDataHora] = useState('');

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('id, client_name, service_name, professional_name, appointment_time, status')
      .order('appointment_time', { ascending: true });

    if (error) {
      console.error('Erro ao carregar agendamentos:', error);
      alert('Erro ao carregar lista');
    } else {
      setAgendamentos(data || []);
    }
    setLoading(false);
  };

  const salvarAgendamento = async () => {
    if (!cliente || !servico || !profissional || !dataHora) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const payload = {
        client_name: cliente.trim(),
        service_name: servico.trim(),
        professional_name: profissional.trim(),
        appointment_time: dataHora, // formato ISO: 2026-02-20T14:30:00
        status: 'confirmed'
      };

      let error;

      if (editing) {
        ({ error } = await supabase
          .from('appointments')
          .update(payload)
          .eq('id', editing.id));
      } else {
        ({ error } = await supabase
          .from('appointments')
          .insert(payload));
      }

      if (error) {
        console.error('Erro Supabase:', error);
        alert(`Erro ao salvar: ${error.message}`);
        return;
      }

      alert(editing ? 'Agendamento atualizado!' : 'Agendamento criado!');
      setModalOpen(false);
      setEditing(null);
      limparFormulario();
      fetchAgendamentos();
    } catch (err) {
      console.error('Exceção:', err);
      alert('Erro inesperado');
    }
  };

  const limparFormulario = () => {
    setCliente('');
    setServico('');
    setProfissional('');
    setDataHora('');
  };

  const editar = (ag: Agendamento) => {
    setEditing(ag);
    setCliente(ag.client_name);
    setServico(ag.service_name);
    setProfissional(ag.professional_name);
    setDataHora(ag.appointment_time.slice(0, 16)); // remove segundos para input datetime-local
    setModalOpen(true);
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir agendamento?')) return;

    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) {
      alert('Erro ao excluir');
    } else {
      fetchAgendamentos();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Agendamentos</h1>
            <p className="text-gray-600">Todos os horários do salão</p>
          </div>
          <button 
            onClick={() => { limparFormulario(); setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-3 bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-pink-700"
          >
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </button>
        </div>

        {loading ? (
          <p className="text-center py-12">Carregando agendamentos...</p>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="text-left p-6 font-medium">Cliente</th>
                  <th className="text-left p-6 font-medium">Serviço</th>
                  <th className="text-left p-6 font-medium">Profissional</th>
                  <th className="text-left p-6 font-medium">Data/Hora</th>
                  <th className="text-left p-6 font-medium">Status</th>
                  <th className="text-right p-6 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {agendamentos.length === 0 ? (
                  <tr><td colSpan={6} className="p-12 text-center text-gray-500">Nenhum agendamento ainda</td></tr>
                ) : (
                  agendamentos.map(ag => (
                    <tr key={ag.id} className="hover:bg-zinc-50">
                      <td className="p-6 font-medium">{ag.client_name}</td>
                      <td className="p-6 text-pink-600">{ag.service_name}</td>
                      <td className="p-6">{ag.professional_name}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4" />
                          {new Date(ag.appointment_time).toLocaleDateString('pt-BR')}
                          <Clock className="w-4 h-4 ml-3" />
                          {new Date(ag.appointment_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm">
                          {ag.status === 'confirmed' ? 'Confirmado' : ag.status}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-4">
                        <button onClick={() => editar(ag)} className="text-blue-600 hover:text-blue-700">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => excluir(ag.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Novo/Editar Agendamento */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-6">
                {editing ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Cliente</label>
                  <input
                    type="text"
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                    placeholder="Maria Oliveira"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Serviço</label>
                  <input
                    type="text"
                    value={servico}
                    onChange={e => setServico(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                    placeholder="Corte Simples"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Profissional</label>
                  <input
                    type="text"
                    value={profissional}
                    onChange={e => setProfissional(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                    placeholder="Ana Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Data e Hora</label>
                  <input
                    type="datetime-local"
                    value={dataHora}
                    onChange={e => setDataHora(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium"
                >
                  Cancelar
                </button>
                <button 
                  onClick={salvarAgendamento}
                  className="flex-1 py-4 bg-pink-600 text-white rounded-2xl font-medium hover:bg-pink-700"
                >
                  {editing ? 'Salvar alterações' : 'Criar Agendamento'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
