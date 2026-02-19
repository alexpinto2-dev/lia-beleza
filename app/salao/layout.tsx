'use client';

import { useEffect, useState } from 'react';

export default function SalaoLayout({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId) {
      fetch('/api/salao/config', {
        headers: { 'x-tenant-id': tenantId }
      })
        .then(res => res.json())
        .then(data => setConfig(data));
    }
  }, []);

  if (!config) return <div>Carregando configurações do salão...</div>;

  return (
    <div style={{
      '--primary': config.primary_color,
      '--secondary': config.secondary_color
    } as React.CSSProperties}>
      <header className="bg-[var(--primary)] text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {config.logo_url && <img src={config.logo_url} alt="Logo" className="h-12" />}
          <h1 className="text-3xl font-bold">{config.name}</h1>
          {config.whatsapp_number && (
            <a href={`https://wa.me/${config.whatsapp_number}`} className="bg-white text-[var(--primary)] px-6 py-3 rounded-full font-medium">
              Falar no WhatsApp
            </a>
          )}
        </div>
      </header>

      <main className="p-8 bg-gray-50 min-h-[calc(100vh-120px)]">
        {children}
      </main>

      <footer className="bg-[var(--primary)] text-white text-center p-4">
        © {new Date().getFullYear()} {config.name} • Powered by Lia Beleza
      </footer>
    </div>
  );
}
