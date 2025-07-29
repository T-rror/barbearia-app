"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SigninForm() {
  const [step, setStep] = useState(1); // 1: email, 2: senha e dados
  const [emailExists, setEmailExists] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const checkEmail = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) throw new Error("Erro ao verificar e-mail");

      const data = await res.json();
      setEmailExists(data.exists);
      setStep(2); // avança para parte da senha/dados
    } catch (err) {
      console.error(err);
      setErro("Erro ao verificar e-mail");
    }

    

  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      let accessToken;

      if (emailExists) {
        // LOGIN
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include', 
            body: JSON.stringify({ email, password }),

          }
        );

        if (!res.ok) throw new Error("Login inválido");

        const data = await res.json();
        accessToken = data.accessToken;
      } else {
        // CADASTRO
        if (password !== confirmPassword) {
          setErro("As senhas não coincidem");
          return;
        }

        if (!name || !phone) {
          setErro("Preencha nome e telefone");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include', 
            body: JSON.stringify({ email, password, name, phone }),
          }
        );

        if (!res.ok) throw new Error("Erro ao criar conta");

        // LOGIN automático após cadastro
        const loginRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include', 
            body: JSON.stringify({ email, password }),
          }
        );

        if (!loginRes.ok) throw new Error("Erro ao fazer login automático");
        const loginData = await loginRes.json();
        accessToken = loginData.accessToken;
      }

      // Armazena o token e busca o perfil
      localStorage.setItem("token", accessToken);

      const me = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const role = me.data.role;
      if (role === "CLIENTE") router.push("/agendamento");
      else if (role === "BARBEIRO") router.push("/admin");
    } catch (err) {
      console.error(err);
      setErro("Erro ao enviar dados");
    }
  };

  return (
    <form
      onSubmit={step === 1 ? checkEmail : handleSubmit}
      className="space-y-4"
    >
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
          {/* CAMPOS DE CADASTRO */}
          {!emailExists && (
            <>
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="tel"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}

          {/* SENHA E CONFIRMAÇÃO */}
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
        {step === 1 ? "Continuar" : emailExists ? "Entrar" : "Criar Conta"}
      </button>

      {step === 2 && (
        <button
          type="button"
          onClick={() => {
            setStep(1);
            setEmailExists(null);
            setPassword("");
            setConfirmPassword("");
            setName("");
            setPhone("");
          }}
          className="text-sm text-gray-500"
        >
          Voltar
        </button>
      )}
    </form>
  );
}
