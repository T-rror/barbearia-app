"use client";

import { useState } from "react";
import { Button } from "../../../../@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../@/components/ui/select";

import { createPayment, confirmPayment } from "../../../lib/payment";

export function CardDemo({
  agendamento,
  onConcluir,
  onCancelar,
  onAtualizar,
  user,
  isConcluido = false,
  isCancelado = false,
}) {
  const [loading, setLoading] = useState(false);
  const [metodo, setMetodo] = useState("CASH");

  if (!agendamento) return null;

  const { id, name, phone, date, time, service } = agendamento;

  let formattedDate = "Data inválida";
  if (date) {
    const dateObj = new Date(date);
    if (!isNaN(dateObj)) {
      formattedDate = dateObj.toLocaleDateString("pt-BR");
    }
  }

  const handlePagamento = async () => {
    try {
      setLoading(true);

      if (!user?.token) throw new Error("Sessão administrativa inválida");
      const payment = await createPayment({ appointmentId: id, method: metodo }, user.token);

      await confirmPayment(payment.id, user.token);
      await onAtualizar?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl text-white">
      <CardHeader>
        <CardTitle className="text-orange-500">{name}</CardTitle>
        <CardDescription className="text-zinc-400">{phone}</CardDescription>

        {isConcluido && (
          <span className="text-green-500 text-sm font-semibold">
            ✓ Concluído
          </span>
        )}

        {isCancelado && (
          <span className="text-red-500 text-sm font-semibold">
            ✗ Cancelado
          </span>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Serviço</span>
            <span>{service}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Data</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Hora</span>
            <span>{time}</span>
          </div>
        </div>
      </CardContent>

      {!isConcluido && !isCancelado && (
        <CardFooter className="flex flex-col gap-2">
          {user?.role === "ADMIN" ? (
            <>
              <Select onValueChange={setMetodo} defaultValue="CASH">
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Forma de pagamento" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 text-white">
                  <SelectItem value="CASH">Dinheiro</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="CARD">Cartão</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handlePagamento} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? "Processando..." : "Receber e Concluir"}
              </Button>
            </>
          ) : (
            <Button onClick={() => onConcluir(id)} className="w-full bg-green-600 hover:bg-green-700">
              Concluir
            </Button>
          )}

          <Button
            onClick={() => onCancelar(id)}
            variant="secondary"
            className="w-full"
          >
            Cancelar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
