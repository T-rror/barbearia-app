import { Button } from "../../../../@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function CardDemo({ agendamento }) {
  if (!agendamento) return null;

  const { name, phone, data, time, service } = agendamento;
  const formattedDate = new Date(data).toLocaleDateString("pt-BR",{
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{phone}</CardDescription>
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

      <CardFooter className="flex-col gap-2">
        {/* Aqui você pode colocar botões de ação */}
        {/* <Button variant="outline">Concluir</Button> */}
      </CardFooter>
    </Card>
  );
}
