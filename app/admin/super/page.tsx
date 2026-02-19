'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  owner_email: string;
  phone: string;
  status: string;
  created_at: string;
};

export default function SuperAdmin() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Campos do formulário de novo salão
  const [nomeSalao, setNomeSalao] = useState('');
  const [subdominio, setSubdominio] = useState('');
  const [emailDono, setEmailDono] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Erro ao carregar tenants:', error);
    else setTenants(data || []);
    setLoading(false);
  };

const criarNovoSalao = async () => {
  if (!nomeSalao || !subdominio || !emailDono) {
    alert('Preencha nome, subdomínio e email do dono');
    return;
  }

  try {
    // 1. Cria o tenant
    const { data: tenant, error: tenantErr } = await supabase
      .from('tenants')
      .insert({
        name: nomeSalao.trim(),
        subdomain: subdominio.trim().toLowerCase(),
        owner_email: emailDono.trim(),
        phone: telefone.trim() || null,
        status: 'active'
      })
      .select()
      .single();

    if (tenantErr || !tenant) throw tenantErr;

    // 2. Gera senha aleatória (8 caracteres)
    const senhaAleatoria = Math.random().toString(36).slice(-8);

    // 3. Cria usuário dono
    const { error: userErr } = await supabase
      .from('tenant_users')
      .insert({
        tenant_id: tenant.id,
        email: emailDono.trim(),
        role: 'owner'
      });

    if (userErr) throw userErr;

    // 4. Cria autenticação no Supabase Auth
    const { error: authErr } = await supabase.auth.admin.createUser({
      email: emailDono.trim(),
      password: senhaAleatoria,
      email_confirm: true
    });

    if (authErr) throw authErr;

    // 5. Envia email com credenciais
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Lia Beleza <no-reply@liabeleza.app>',
        to: [emailDono.trim()],
        subject: 'Bem-vindo ao Lia Beleza SaaS!',
        html: `
          <h1>Seu salão foi cadastrado!</h1>
          <p>Olá! Seu salão <strong>${nomeSalao}</strong> já está ativo na plataforma.</p>
          <p><strong>Login:</strong> ${emailDono}</p>
          <p><strong>Senha temporária:</strong> ${senhaAleatoria}</p>
          <p>Acesse agora: <a href="https://lia-beleza.vercel.app/salao/login">Entrar no painel</a></p>
          <p>Recomendamos trocar a senha no primeiro acesso.</p>
          <p>Qualquer dúvida, responda este email ou fale com o suporte.</p>
          <p>Abraços,<br>Equipe Lia Beleza</p>
        `
      })
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Erro Resend:', err);
      alert('Salão criado, mas falha ao enviar email. Verifique o console.');
    } else {
      alert('Novo salão criado e email enviado com sucesso!');
    }

    setModalOpen(false);
    limparFormulario();
    fetchTenants();
  } catch (err) {
    console.error('Erro ao criar salão:', err);
    alert('Erro ao criar salão. Veja o console.');
  }
};
  //  const criarNovoSalao = async () => {
  //  if (!nomeSalao || !subdominio || !emailDono) {
    //  alert('Preencha nome do salão, subdomínio e email do dono');
      //return;
    //}
//
  //  const { error } = await supabase
    //  .from('tenants')
      //.insert({
        //name: nomeSalao.trim(),
       // subdomain: subdominio.trim().toLowerCase(),
       // owner_email: emailDono.trim(),
       // phone: telefone.trim() || null,
       // status: 'active'
      //});
//
  //  if (error) {
    //  console.error('Erro ao criar tenant:', error);
      //alert(`Erro: ${error.message}`);
   // } else {
     // alert('Novo salão criado com sucesso!');
     // setModalOpen(false);
     // limparFormulario();
     // fetchTenants(); // recarrega a lista
   // }
  };

  const limparFormulario = () => {
    setNomeSalao('');
    setSubdominio('');
    setEmailDono('');
    setTelefone('');
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">Super Admin</h1>
            <p className="text-xl text-gray-600 mt-2">Controle total da plataforma Lia Beleza</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            Cadastrar Novo Salão
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-100">
              <tr>
                <th className="text-left p-6 font-medium">Salão</th>
                <th className="text-left p-6 font-medium">Subdomínio</th>
                <th className="text-left p-6 font-medium">Dono</th>
                <th className="text-left p-6 font-medium">Telefone</th>
                <th className="text-left p-6 font-medium">Status</th>
                <th className="text-left p-6 font-medium">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center">Carregando salões...</td></tr>
              ) : tenants.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-500">Nenhum salão cadastrado ainda</td></tr>
              ) : (
                tenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-zinc-50">
                    <td className="p-6 font-semibold">{tenant.name}</td>
                    <td className="p-6 text-pink-600 font-medium">{tenant.subdomain}</td>
                    <td className="p-6">{tenant.owner_email}</td>
                    <td className="p-6">{tenant.phone || '-'}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1 rounded-full text-sm ${tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="p-6 text-gray-500">
                      {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Novo Salão */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
              <h2 className="text-3xl font-bold mb-8 text-center">Cadastrar Novo Salão</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Salão</label>
                  <input
                    type="text"
                    value={nomeSalao}
                    onChange={e => setNomeSalao(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                    placeholder="Ex: Beleza Divina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subdomínio (url do salão)</label>
                  <input
                    type="text"
                    value={subdominio}
                    onChange={e => setSubdominio(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                    placeholder="Ex: beleza-divina"
                  />
                  <p className="text-xs text-gray-500 mt-1">Será: {subdominio || 'nome'}.liabeleza.app</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email do dono</label>
                  <input
                    type="email"
                    value={emailDono}
                    onChange={e => setEmailDono(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                    placeholder="dono@salao.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp do salão</label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={e => setTelefone(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-600"
                    placeholder="(79) 99999-9999"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={criarNovoSalao}
                  className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl font-semibold hover:opacity-90"
                >
                  Cadastrar Salão
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
