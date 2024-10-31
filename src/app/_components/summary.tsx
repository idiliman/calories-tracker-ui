"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { deleteIntake, SummaryData } from "@/data/services/ai";
import { use, useState, useTransition } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SummaryProps {
  summaryPromise: Promise<SummaryData | null>;
}

const chartConfig = {
  calories: {
    label: "Calories",
    color: "hsl(var(--chart-1))",
  },
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

export default function Summary({ summaryPromise }: SummaryProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("total");
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const summary = use(summaryPromise);
  const router = useRouter();

  const chartData = summary?.dailyIntakes.reduce(
    (acc, intake) => {
      const existingDate = acc.find(
        (item) => format(new Date(item.month), "MMM dd") === format(new Date(intake.date), "MMM dd")
      );

      if (existingDate) {
        existingDate.calories += parseFloat(intake.summary.calories);
        existingDate.protein += parseFloat(intake.summary.protein);
        existingDate.carbs += parseFloat(intake.summary.carbs);
        existingDate.fat += parseFloat(intake.summary.fat);
      } else {
        acc.push({
          month: format(new Date(intake.date), "MMM dd"),
          calories: parseFloat(intake.summary.calories),
          protein: parseFloat(intake.summary.protein),
          carbs: parseFloat(intake.summary.carbs),
          fat: parseFloat(intake.summary.fat),
        });
      }

      return acc;
    },
    [] as Array<{
      month: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>
  );

  const handleDeleteIntake = (date: string) => {
    startTransition(async () => {
      try {
        const res = await deleteIntake(date);
        if (res.status === 200) {
          router.refresh();
        } else {
          console.log("Failed to delete intake:", res.error);
        }
      } catch (error) {
        console.log("Failed to delete intake:", error);
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="total">Total</TabsTrigger>
          <TabsTrigger value="average">Average</TabsTrigger>
        </TabsList>
        <TabsContent value="total">
          <Card>
            <CardHeader>
              <CardTitle>Total Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Calories</Badge>
                  <span>{summary?.overallSummary.total.calories}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Protein</Badge>
                  <span>{summary?.overallSummary.total.protein}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Carbs</Badge>
                  <span>{summary?.overallSummary.total.carbs}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Fat</Badge>
                  <span>{summary?.overallSummary.total.fat}g</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="average">
          <Card>
            <CardHeader>
              <CardTitle>Average Daily Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Calories</Badge>
                  <span>{summary?.overallSummary.average.calories}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Protein</Badge>
                  <span>{summary?.overallSummary.average.protein}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Carbs</Badge>
                  <span>{summary?.overallSummary.average.carbs}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Fat</Badge>
                  <span>{summary?.overallSummary.average.fat}g</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Daily Intake Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] w-full"
          >
            <BarChart
              width={isDesktop ? 350 : 300}
              height={200}
              accessibilityLayer
              data={chartData}
            >
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
              <Bar
                dataKey="calories"
                fill="var(--color-calories)"
                radius={4}
              />
              <Bar
                dataKey="protein"
                fill="var(--color-protein)"
                radius={4}
              />
              <Bar
                dataKey="carbs"
                fill="var(--color-carbs)"
                radius={4}
              />
              <Bar
                dataKey="fat"
                fill="var(--color-fat)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Daily Intake Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px]">
            <Accordion
              type="single"
              collapsible
              className="w-full"
            >
              {summary?.dailyIntakes.map((intake, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                >
                  <AccordionTrigger>
                    <div className="flex items-center justify-center">
                      <Button
                        className="w-9 mr-2"
                        asChild
                        disabled={isPending}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIntake(intake.date)}
                      >
                        <Trash2 className="size-4" />
                      </Button>

                      <span>{format(new Date(intake.date), "MMMM d, yyyy hh:mm:ss")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Food</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Calories</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {intake.foods.map((food, foodIndex) => (
                          <TableRow key={foodIndex}>
                            <TableCell>{food.name}</TableCell>
                            <TableCell>{food.amount}</TableCell>
                            <TableCell>{food.calories}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Badge>Calories</Badge>
                        <span>{intake.summary.calories}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Protein</Badge>
                        <span>{intake.summary.protein}g</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Carbs</Badge>
                        <span>{intake.summary.carbs}g</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Fat</Badge>
                        <span>{intake.summary.fat}g</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
