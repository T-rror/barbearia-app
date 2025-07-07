'use client';
import { useState } from 'react';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login inválido');

      const data = await res.json();
      localStorage.setItem('token', data.accessToken);

      // Redirecionar para /admin (ou outra rota protegida)
      window.location.href = '/admin';
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && <p className="text-red-500">{erro}</p>}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-black text-white py-2 rounded">
        Entrar
      </button>
    </form>
  );
}
