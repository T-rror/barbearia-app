import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "../../../../@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import { useMemo } from "react";

// Espera os dados como prop
export function MyChart({ agendamentos, titulo = "Agendamentos"}) {
  // Agrupar por mês fictício (só como exemplo, já que não tem datas reais)
 
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  };

   const chartData = useMemo(() => {
    const agrupado = {};

    agendamentos.forEach(({ data, origem }) => {
      const date = new Date(data);
      if (isNaN(date)) return; // ignora data inválida

      const mes = date.toLocaleString("default", { month: "short" }); // ex: "Jan"

      if (!agrupado[mes]) {
        agrupado[mes] = { month: mes, desktop: 0, mobile: 0 };
      }

      if (origem === "desktop") {
        agrupado[mes].desktop += 1;
      } else if (origem === "mobile") {
        agrupado[mes].mobile += 1;
      }
    });

    // Retorna um array ordenado por mês fictício (poderia ordenar corretamente se desejar)
    return Object.values(agrupado);
  }, [agendamentos]);
  

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>Visualização mensal dos atendimentos</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter />
    </Card>
  );
}
