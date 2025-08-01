import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartContainer, ChartTooltipContent, ChartConfig, ChartTooltip, ChartLegend, ChartLegendContent } from "../../../../@/components/ui/chart";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";

import { Button } from "../../../../@/components/ui/button";



export function MyChart() {
  const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} 


  return (

     <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>agendamento</CardTitle>
        <CardDescription>status do agendameto</CardDescription>
        <CardAction>
          <Button variant="link">concluir</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
   <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      
      
      </BarChart>
    </ChartContainer>
     </CardContent>
      <CardFooter className="flex-col gap-2">
       
      </CardFooter>
    </Card>
  )
}






     
       
     