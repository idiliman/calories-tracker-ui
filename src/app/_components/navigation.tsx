"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart2, Utensils } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant={cn(pathname === "/" ? "default" : "outline") as ButtonProps["variant"]}
        asChild
        className="w-full"
      >
        <Link href="/">
          <Utensils className="mr-2 h-4 w-4" />
          Home
        </Link>
      </Button>
      <Button
        asChild
        variant={cn(pathname === "/summary" ? "default" : "outline") as ButtonProps["variant"]}
        className="w-full"
      >
        <Link href="/summary">
          <BarChart2 className="mr-2 h-4 w-4" />
          Summary
        </Link>
      </Button>
    </div>
  );
}
