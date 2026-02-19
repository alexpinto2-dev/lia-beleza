'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'admin' && password === '123456') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white text-4xl mb-4">
            💇🏻‍♀️
          </div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Lia Beleza • Aracaju/SE</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-pink-600"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-pink-600"
              placeholder="123456"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition"
          >
            Entrar no Painel
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Usuário: <strong>admin</strong> • Senha: <strong>123456</strong>
        </p>
      </div>
    </div>
  );
}
