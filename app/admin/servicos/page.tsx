'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

type Servico = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([
    { id: '1', name: 'Corte Simples', price: 85, duration_minutes: 45 },
    { id: '2', name: 'Corte + Escova', price: 120, duration_minutes: 70 },
    { id: '3', name: 'Hidratação', price: 65, duration_minutes: 40 },
    { id: '4', name: 'Manicure Completa', price: 55, duration_minutes: 50 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');

  const salvarServico = () => {
    if (!nome || !preco || !duracao) return;

    const novoServico = {
      id: editing ? editing.id : Date.now().toString(),
      name: nome,
      price: parseFloat(preco),
      duration_minutes: parseInt(duracao)
    };

    if (editing) {
      setServicos(servicos.map(s => s.id === editing.id ? novoServico : s));
    } else {
      setServicos([...servicos, novoServico]);
    }

    setModalOpen(false);
    setEditing(null);
    setNome('');
    setPreco('');
    setDuracao('');
  };

  const editar = (serv: Servico) => {
    setEditing(serv);
    setNome(serv.name);
    setPreco(serv.price.toString());
    setDuracao(serv.duration_minutes.toString());
    setModalOpen(true);
  };

  const excluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServicos(servicos.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Serviços</h1>
            <p className="text-gray-600">Gerencie os serviços oferecidos no salão</p>
          </div>
          <button 
            onClick={() => { setEditing(null); setNome(''); setPreco(''); setDuracao(''); setModalOpen(true); }}
            className="flex items-center gap-3 bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-pink-700 transition"
          >
            <Plus className="w-5 h-5" />
            Novo Serviço
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left p-6 font-medium">Serviço</th>
                <th className="text-left p-6 font-medium">Preço</th>
                <th className="text-left p-6 font-medium">Duração</th>
                <th className="text-right p-6 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {servicos.map(serv => (
                <tr key={serv.id} className="hover:bg-zinc-50">
                  <td className="p-6 font-medium">{serv.name}</td>
                  <td className="p-6 text-emerald-600 font-semibold">R$ {serv.price.toFixed(2)}</td>
                  <td className="p-6 text-gray-600">{serv.duration_minutes} minutos</td>
                  <td className="p-6 text-right space-x-4">
                    <button onClick={() => editar(serv)} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => excluir(serv.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">
                {editing ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>

              <input
                type="text"
                placeholder="Nome do serviço"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-4"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Preço (R$)</label>
                  <input
                    type="number"
                    placeholder="85"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Duração (minutos)</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={duracao}
                    onChange={(e) => setDuracao(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 mt-1"
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
                  onClick={salvarServico}
                  className="flex-1 py-4 bg-pink-600 text-white rounded-2xl font-medium hover:bg-pink-700"
                >
                  Salvar Serviço
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
