"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SummarySkeleton() {
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
