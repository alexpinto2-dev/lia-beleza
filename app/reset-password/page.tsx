'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const accessToken = searchParams.get('token'); // token do link de recuperação

  useEffect(() => {
    if (!accessToken) {
      setError('Link de recuperação inválido ou expirado.');
    }
  }, [accessToken]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setMessage('Senha alterada com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        router.push('/salao/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao resetar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white text-4xl mb-4">
            🔑
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Resetar Senha</h1>
          <p className="text-gray-600 mt-2">Crie uma nova senha segura para acessar seu painel.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-200"
              placeholder="Digite sua nova senha"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-200"
              placeholder="Digite novamente"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white'
            }`}
          >
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Lembrou a senha? <a href="/salao/login" className="text-pink-600 hover:underline">Fazer login</a>
        </p>
      </div>
    </div>
  );
}
