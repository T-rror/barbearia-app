'use client';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(''); 
  const router = useRouter();

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

      const accessToken = data.accessToken;
      localStorage.setItem('token', data.accessToken);

      // Redirecionar para /admin (ou outra rota protegida)
     const me = await axios.get('http://localhost:3001/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const role = me.data.role;

      // Redireciona com base na role
      if (role === 'CLIENTE') {
        router.push('/agendamento');
      } else if (role === 'BARBEIRO') {
        router.push('/admin');
      }

    } catch (err) {
      alert('Erro no login');
      console.error(err);
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
