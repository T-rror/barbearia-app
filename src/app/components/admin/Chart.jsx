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

// Espera os dados como prop
export function MyChart({ agendamentos, titulo = "Agendamentos" }) {
  // Agrupar por mês fictício (só como exemplo, já que não tem datas reais)
  const chartData = [
    { month: "Jan", desktop: 20, mobile: 10 },
    { month: "Feb", desktop: 35, mobile: 20 },
    { month: "Mar", desktop: 25, mobile: 15 },
    { month: "Apr", desktop: 40, mobile: 30 },
  ];

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
