import { Button } from "../../../../@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";

export function CardDemo({
  agendamento,
  onConcluir,
  onCancelar,
  isConcluido = false,
  isCancelado = false,
}) {
  if (!agendamento) return null;

  const { name, phone, date, time, service } = agendamento;

  let formattedDate = "Data inválida";
  if (date) {
    const dateObj = new Date(date);
    if (!isNaN(dateObj)) {
      formattedDate = dateObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }

  return (
    <Card className="w-full max-w-sm rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{phone}</CardDescription>
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
        <article className="flex flex-col gap-2 border-b py-2">
          <div className="flex justify-between">
            <span className="font-semibold">Serviço:</span>
            <span>{service}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Data:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Hora:</span>
            <span>{time}</span>
          </div>
        </article>
      </CardContent>

      {!isConcluido && !isCancelado && (
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={() => onConcluir(agendamento.id)}
            variant="outline"
            className="w-full"
          >
            Concluir
          </Button>
          <Button
            onClick={() => onCancelar(agendamento.id)}
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
