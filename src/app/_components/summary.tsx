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
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [keyToDelete, setKeyToDelete] = useState<string | null>();
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
    setKeyToDelete(date);
    startTransition(async () => {
      try {
        const res = await deleteIntake(date);

        if (res.status === 200) {
          router.refresh();
          return;
        }

        if (res.status === 429) {
          toast.error("Rate limit exceeded");
        } else {
          toast.error("Failed to delete intake");
        }
      } catch (error) {
        console.log("Failed to delete intake:", error);
        toast.error("Failed to delete intake");
      } finally {
        setKeyToDelete(null);
      }
    });
  };

  return (
    <div className="space-y-6">
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
                        {isPending && keyToDelete === intake.date ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
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
                          <TableHead>Protein</TableHead>
                          <TableHead>Carbs</TableHead>
                          <TableHead>Fat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {intake.foods.map((food, foodIndex) => (
                          <TableRow key={foodIndex}>
                            <TableCell>{food.name}</TableCell>
                            <TableCell>{food.amount}</TableCell>
                            <TableCell>{food.calories}</TableCell>
                            <TableCell>{food.protein}</TableCell>
                            <TableCell>{food.carbs}</TableCell>
                            <TableCell>{food.fat}</TableCell>
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

export function SummarySkeleton() {
  return (
    <div className="space-y-6 h-full">
      <h1 className="text-2xl font-bold text-center">Nutrition Summary</h1>
      <Tabs defaultValue="total">
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
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2"
                  >
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
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
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2"
                  >
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
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
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Intake Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="single"
            collapsible
            className="w-full"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
              >
                <AccordionTrigger>
                  <Skeleton className="h-4 w-40" />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Table skeleton */}
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex gap-4"
                        >
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>

                    {/* Summary skeleton */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2"
                        >
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
