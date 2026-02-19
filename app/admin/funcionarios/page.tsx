'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Funcionario = {
  id: string;
  name: string;
  color: string;
};

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Funcionario | null>(null);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#FF69B4');

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('professionals').select('id, name, color');
    if (error) {
      console.error('Erro ao carregar funcionários:', error);
    } else {
      setFuncionarios(data || []);
    }
    setLoading(false);
  };

  const salvarFuncionario = async () => {
    if (!nome.trim()) return;

    if (editing) {
      const { error } = await supabase
        .from('professionals')
        .update({ name: nome, color: cor })
        .eq('id', editing.id);

      if (error) {
        alert('Erro ao atualizar funcionário');
        return;
      }
    } else {
      const { error } = await supabase
        .from('professionals')
        .insert({ name: nome, color: cor });

      if (error) {
        alert('Erro ao criar funcionário');
        return;
      }
    }

    setModalOpen(false);
    setEditing(null);
    setNome('');
    setCor('#FF69B4');
    fetchFuncionarios();  // recarrega a lista
  };

  const excluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

    const { error } = await supabase.from('professionals').delete().eq('id', id);
    if (error) {
      alert('Erro ao excluir');
    } else {
      fetchFuncionarios();
    }
  };

  const abrirModalNovo = () => {
    setEditing(null);
    setNome('');
    setCor('#FF69B4');
    setModalOpen(true);
  };

  const abrirModalEditar = (func: Funcionario) => {
    setEditing(func);
    setNome(func.name);
    setCor(func.color);
    setModalOpen(true);
  };

  // ────────────────────────────────────────────────
  // O RETURN DEVE ESTAR AQUI (nível principal da página)
  // ────────────────────────────────────────────────
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Funcionários</h1>
            <p className="text-gray-600">Gerencie sua equipe</p>
          </div>
          <button 
            onClick={abrirModalNovo}
            className="flex items-center gap-3 bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-pink-700"
          >
            <Plus className="w-5 h-5" />
            Novo Funcionário
          </button>
        </div>

        {loading ? (
          <p className="text-center py-12">Carregando funcionários...</p>
        ) : (
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
                      <button onClick={() => abrirModalEditar(func)} className="text-blue-600 hover:text-blue-700">
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
        )}

        {/* Modal */}
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
