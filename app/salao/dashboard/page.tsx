'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SalaoDashboard() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/salao/login');
        return;
      }

      setUser(user);

      // Busca o tenant_id do usuário logado
      const { data: tenantUser } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('email', user.email)
        .single();

      if (!tenantUser?.tenant_id) {
        alert('Usuário sem salão associado');
        router.push('/salao/login');
        return;
      }

      setTenantId(tenantUser.tenant_id);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <div className="p-10 text-center">Carregando painel do salão...</div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">Bem-vindo ao seu painel!</h1>
            <p className="text-gray-600 mt-2">Você está logado como dono do salão</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/salao/login'))}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl"
          >
            Sair
          </button>
        </div>

        {/* Aqui você pode colocar widgets específicos do salão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-xl font-semibold">Agendamentos hoje</h3>
            <p className="text-4xl font-bold mt-4">0</p> {/* Depois puxa do banco filtrado por tenant_id */}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-xl font-semibold">Faturamento estimado</h3>
            <p className="text-4xl font-bold mt-4">R$ 0,00</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-xl font-semibold">Taxa de ocupação</h3>
            <p className="text-4xl font-bold mt-4">0%</p>
          </div>
        </div>

        <p className="text-center mt-12 text-gray-500">
          Em breve: agenda completa, funcionários, serviços e Lia exclusivos do seu salão
        </p>
      </div>
    </div>
  );
}
