import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

const todayIntake = {
  calories: 1200,
  protein: 60,
  carbs: 150,
  fat: 40,
};

const macroData = [
  { name: "Protein", value: todayIntake.protein, fill: "hsl(var(--chart-1))" },
  { name: "Carbs", value: todayIntake.carbs, fill: "hsl(var(--chart-2))" },
  { name: "Fat", value: todayIntake.fat, fill: "hsl(var(--chart-3))" },
];

const chartConfig = {
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-2))",
  },
  carbs: {
    label: "Carbs",
    color: "hsl(var(--chart-3))",
  },
  fat: {
    label: "Fat",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function MacroCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Macronutrients</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] w-full"
        >
          <PieChart
            width={200}
            height={150}
          >
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend className="mt-4" />
            <Pie
              data={macroData}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="80%"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
