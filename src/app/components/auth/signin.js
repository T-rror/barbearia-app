"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../lib/api"; // axios centralizado

import { Card, CardContent, CardDescription, CardHeader } from "../../../../@/components/ui/card";

// Validação separada para cada etapa
const step1Schema = yup.object({
  email: yup.string().email("E-mail inválido").required("Informe seu e-mail"),
});

const step2Schema = (isLogin) =>
  yup.object({
    password: yup.string().min(6, "Mínimo de 6 caracteres").required("Senha obrigatória"),
    confirmPassword: !isLogin
      ? yup
          .string()
          .oneOf([yup.ref("password")], "Senhas não coincidem")
          .required("Confirme a senha")
      : yup.string().notRequired(),
    name: !isLogin ? yup.string().required("Nome obrigatório") : yup.string().notRequired(),
    phone: !isLogin ? yup.string().required("Telefone obrigatório") : yup.string().notRequired(),
  });

export default function SigninForm() {
  const [step, setStep] = useState(1);
  const [emailExists, setEmailExists] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(step1Schema),
  });

  const email = watch("email");

  // Etapa 1 → verifica se o e-mail existe
  const checkEmail = async (data) => {
    try {
      const res = await api.post("/auth/check-email", { email: data.email });
      setEmailExists(res.data.exists);

      // Muda para a validação da etapa 2
      reset({ email: data.email }, { keepValues: true });
      setStep(2);
    } catch {
      alert("Erro ao verificar e-mail");
    }
  };

  // Etapa 2 → login ou cadastro
  const handleAuth = async (data) => {
    try {
      let accessToken;

      if (emailExists) {
        // LOGIN
        const res = await api.post("/auth/signin", {
          email: data.email,
          password: data.password,
        });
        accessToken = res.data.accessToken;
      } else {
        // CADASTRO
        const res = await api.post("/auth/signup", {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
        });

        // LOGIN automático
        const loginRes = await api.post("/auth/signin", {
          email: data.email,
          password: data.password,
        });
        accessToken = loginRes.data.accessToken;
      }

      // Salva token e redireciona
      localStorage.setItem("token", accessToken);

      const me = await api.get("/auth/me");
      if (me.data.role === "CLIENTE") router.push("/agendamento");
      else router.push("/admin");
    } catch {
      alert("Erro na autenticação");
    }
  };

  return (
    <Card className="bg-black/50 w-full max-w-sm">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">
          Entrar ou <span className="text-green-500">Criar Conta</span>
        </h2>
      </CardHeader>
      <CardDescription className="text-center mb-4">
        <p className="text-gray-500">
          Digite seu e-mail para fazer login ou criar uma conta
        </p>
      </CardDescription>
      <CardContent className="space-y-6">
        <form
          onSubmit={handleSubmit(step === 1 ? checkEmail : handleAuth)}
          className="space-y-4"
        >
          {/* E-mail */}
          <div>
            <input
              type="email"
              placeholder="E-mail"
              {...register("email")}
              className="w-full p-2 border rounded-3xl text-blue-500 text-center"
              disabled={step === 2}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Etapa 2 */}
          {step === 2 && (
            <>
              {!emailExists && (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder="Nome"
                      {...register("name")}
                      className="w-full p-2 border-none rounded-3xl text-blue-500 text-center"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Telefone"
                      {...register("phone")}
                      className="w-full p-2 border-none rounded-3xl text-blue-500 text-center"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <input
                  type="password"
                  placeholder="Senha"
                  {...register("password")}
                  className="w-full p-2 border-none rounded-3xl text-blue-500 text-center"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {!emailExists && (
                <div>
                  <input
                    type="password"
                    placeholder="Confirmar senha"
                    {...register("confirmPassword")}
                    className="w-full p-2 border-none rounded-3xl text-blue-500 text-center"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Botão principal */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded-3xl"
          >
            {step === 1
              ? "Continuar"
              : emailExists
              ? "Entrar"
              : "Criar Conta"}
          </button>

          {/* Voltar */}
          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setEmailExists(null);
                reset({}, { keepValues: false });
              }}
              className="text-sm text-gray-500 rounded-3xl hover:text-red-500 transition text-center"
            >
              Voltar
            </button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
