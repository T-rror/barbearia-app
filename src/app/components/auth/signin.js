'use client';

import { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default  function SigninForm() {
  const [step, setStep] = useState(1); // 1: email, 2: senha
  const [emailExists, setEmailExists] = useState(null);
 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const checkEmail = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setEmailExists(data.exists);
      setStep(2); // avança para parte da senha
    } catch (err) {
      console.error(err);
      setErro('Erro ao verificar e-mail');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      // Se o email já existe → login
      if (emailExists) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error('Login inválido');

        const data = await res.json();
        localStorage.setItem('token', data.accessToken);

        // Verifica role
        const me = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });

        const role = me.data.role;
        if (role === 'CLIENTE') router.push('/agendamento');
        else if (role === 'BARBEIRO') router.push('/admin');
      }

      // Se o email não existe → cadastro
      else {
        if (password !== confirmPassword) {
          setErro('As senhas não coincidem');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name: null, // pode ser ajustado futuramente
          }),
        });

        if (!res.ok) throw new Error('Erro ao criar conta');

        alert('Conta criada com sucesso! Agora é só fazer o agendamento.');
        router.push('/agendamento');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao enviar dados');
    }

     
  };

 


  return (
    <form onSubmit={step === 1 ? checkEmail : handleSubmit} className="space-y-4">
      {erro && <p className="text-red-500">{erro}</p>}

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
        disabled={step === 2}
      />

      {step === 2 && (
        <>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {!emailExists && (
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}
        </>
      )}

      <button type="submit" className="w-full bg-black text-white py-2 rounded">
        {step === 1
          ? 'Continuar'
          : emailExists
          ? 'Entrar'
          : 'Criar Conta'}
      </button>

      {step === 2 && (
        <button
          type="button"
          onClick={() => {
            setStep(1);
            setEmailExists(null);
            setPassword('');
            setConfirmPassword('');
          }}
          className="text-sm text-gray-500"
        >
          Voltar
        </button>
      )}
    </form>
  );
}
