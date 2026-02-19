'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

type Funcionario = {
  id: string;
  name: string;
  color: string;
};

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    { id: '1', name: 'Ana Silva', color: '#FF69B4' },
    { id: '2', name: 'Julia Mendes', color: '#C084FC' },
    { id: '3', name: 'Carla Santos', color: '#4ADE80' },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Funcionario | null>(null);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#FF69B4');

  const salvarFuncionario = () => {
    if (!nome) return;

    if (editing) {
      setFuncionarios(funcionarios.map(f => 
        f.id === editing.id ? { ...f, name: nome, color: cor } : f
      ));
    } else {
      setFuncionarios([...funcionarios, {
        id: Date.now().toString(),
        name: nome,
        color: cor
      }]);
    }

    setModalOpen(false);
    setEditing(null);
    setNome('');
  };

  const editar = (func: Funcionario) => {
    setEditing(func);
    setNome(func.name);
    setCor(func.color);
    setModalOpen(true);
  };

  const excluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(funcionarios.filter(f => f.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Funcionários</h1>
            <p className="text-gray-600">Gerencie sua equipe</p>
          </div>
          <button 
            onClick={() => { setEditing(null); setNome(''); setCor('#FF69B4'); setModalOpen(true); }}
            className="flex items-center gap-3 bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-pink-700"
          >
            <Plus className="w-5 h-5" />
            Novo Funcionário
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left p-6 font-medium">Funcionário</th>
                <th className="text-left p-6 font-medium">Cor no Calendário</th>
                <th className="text-right p-6 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {funcionarios.map(func => (
                <tr key={func.id} className="hover:bg-zinc-50">
                  <td className="p-6 font-medium flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl" style={{ backgroundColor: func.color }}></div>
                    {func.name}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: func.color }}></div>
                      {func.color}
                    </div>
                  </td>
                  <td className="p-6 text-right space-x-3">
                    <button onClick={() => editar(func)} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => excluir(func.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Cadastro/Edição */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">
                {editing ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h2>

              <input
                type="text"
                placeholder="Nome do funcionário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-4 focus:outline-none focus:border-pink-600"
              />

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Cor no calendário</p>
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-full h-12 rounded-xl cursor-pointer"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium"
                >
                  Cancelar
                </button>
                <button 
                  onClick={salvarFuncionario}
                  className="flex-1 py-4 bg-pink-600 text-white rounded-2xl font-medium hover:bg-pink-700"
                >
                  {editing ? 'Salvar alterações' : 'Cadastrar funcionário'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
