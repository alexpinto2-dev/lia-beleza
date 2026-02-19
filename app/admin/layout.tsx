'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, Users, Scissors, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isSuperAdmin = true; // ← Por enquanto só você tem acesso (depois vamos deixar dinâmico)

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl">
            💇🏻‍♀️
          </div>
          <div>
            <p className="font-bold text-2xl text-pink-600">Lia Beleza</p>
            <p className="text-xs text-gray-500">SaaS para Salões</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-pink-50 transition ${pathname === '/admin' ? 'bg-pink-100 text-pink-600' : 'text-gray-700'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link href="/admin/agendamentos" className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-pink-50 transition ${pathname === '/admin/agendamentos' ? 'bg-pink-100 text-pink-600' : 'text-gray-700'}`}>
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Agendamentos</span>
          </Link>

          <Link href="/admin/funcionarios" className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-pink-50 transition ${pathname === '/admin/funcionarios' ? 'bg-pink-100 text-pink-600' : 'text-gray-700'}`}>
            <Users className="w-5 h-5" />
            <span className="font-medium">Funcionários</span>
          </Link>

          <Link href="/admin/servicos" className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-pink-50 transition ${pathname === '/admin/servicos' ? 'bg-pink-100 text-pink-600' : 'text-gray-700'}`}>
            <Scissors className="w-5 h-5" />
            <span className="font-medium">Serviços</span>
          </Link>

          {/* Link do Super Admin - só aparece para você */}
          {isSuperAdmin && (
            <Link href="/admin/super" className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-pink-50 transition ${pathname === '/admin/super' ? 'bg-pink-100 text-pink-600' : 'text-gray-700'}`}>
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Super Admin</span>
            </Link>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
