"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";
import { BRANDS } from "@/config/constants";

const chartConfig = {
  brands: {
    label: "Brands",
  },
  ...BRANDS.reduce((acc, brand, i) => {
    acc[brand.value] = {
      label: brand.label,
      //! assign color programatically
      color: `hsl(var(--chart-${i + 1}))`,
    };
    return acc;
  }, {}),
};

const fetchMonthlyOrderStat = async (month) => {
  return await apiClient.get("/orders/stat?month=" + month);
};

export function BrandsPieChart({ chartData }) {
  // const [month, setMonth] = useState(0);
  // const {
  //   isPending,
  //   isError,
  //   error,
  //   data: chartData = { start: Date.now(), end: Date.now(), data: [] },
  //   isFetching,
  //   isPlaceholderData,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["order-stat", month],
  //   queryFn: () => fetchMonthlyOrderStat(month),
  //   placeholderData: keepPreviousData,
  //   //! change this
  //   staleTime: 60 * 60 * 60,
  // });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Brands sales share</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="brand"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
