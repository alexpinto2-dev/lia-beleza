'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetch('/api/super/tenants')
      .then(res => res.json())
      .then(data => {
        setTenants(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">Super Admin</h1>
            <p className="text-xl text-gray-600 mt-2">Controle total da plataforma Lia Beleza</p>
          </div>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg">
            + Novo Salão
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
              ) : tenants.map(tenant => (
                <tr key={tenant.id} className="hover:bg-zinc-50">
                  <td className="p-6 font-semibold">{tenant.name}</td>
                  <td className="p-6 text-pink-600 font-medium">{tenant.subdomain}</td>
                  <td className="p-6">{tenant.owner_email}</td>
                  <td className="p-6">{tenant.phone}</td>
                  <td className="p-6">
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
                      {tenant.status}
                    </span>
                  </td>
                  <td className="p-6 text-gray-500">
                    {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Aqui você verá todos os salões que comprarem o Lia Beleza SaaS
        </p>
      </div>
    </div>
  );
}
