"use client";

import Container from "@/components/container";
import SaleGraph, { Component } from "./_components/sell-chart";
import { BrandsPieChart } from "./_components/brands-pie";
import { useCallback, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { getGrowthPercentage } from "@/lib/growth-percentage";
import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

const fetchMonthlyOrderStat = async (month) => {
  return await apiClient.get("/orders/stat?month=" + month);
};

export default function StatPage() {
  const [month, setMonth] = useState(0);
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["sales-stat", month],
    queryFn: () => fetchMonthlyOrderStat(month),
    placeholderData: keepPreviousData,
    //! change this
    staleTime: 60 * 60 * 60,
  });

  const growthRates = useMemo(() => {
    if (data) {
      return {
        buyers: getGrowthPercentage(data.buyers, data.lBuyers),
        sales: getGrowthPercentage(data.sandR[0].sales, data.lMSandR[0].sales),
        revenue: getGrowthPercentage(
          data.sandR[0].revenue,
          data.lMSandR[0].revenue
        ),
      };
    }
  }, [data]);

  return (
    <main>
      <Container>
        <SaleGraph month={month} />
        <div className="flex justify-between my-6">
          <Button
            variant="outline"
            onClick={() => {
              setMonth((old) => (old += 1));
            }}
          >
            <ChevronLeftIcon /> Previous Month
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (month === 0) {
                return;
              } else {
                setMonth((old) => (old -= 1));
              }
            }}
          >
            Next Month <ChevronRightIcon />
          </Button>
        </div>
        {isPending ? (
          ""
        ) : error ? (
          <div>{error.message}</div>
        ) : (
          <section className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <BrandsPieChart chartData={data.brandShare} />
            </div>
            <div className="grid md:grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center rounded-md bg-primary-drk text-primary-foreground h-24 md:h-auto relative">
                <div className="absolute top-3 right-3">
                  {growthRates.buyers ? (
                    growthRates.buyers > 0 ? (
                      <div className="bg-green-700/50 rounded-full flex items-center justify-center p-2 text-green-300">
                        <ArrowUp className="" /> <p>{growthRates.buyers}%</p>
                      </div>
                    ) : (
                      <div className="bg-red-700/50 rounded-full flex items-center justify-center p-2 text-red-300">
                        <ArrowDown className="" /> <p>{growthRates.buyers}%</p>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>

                <h3 className="font-header">{data.buyers} Buyers</h3>
              </div>
              <div className="flex items-center justify-center rounded-md bg-primary text-primary-foreground relative h-24 md:h-auto">
                <div className="absolute top-3 right-3">
                  {growthRates.sales ? (
                    growthRates.sales > 0 ? (
                      <div className="bg-green-700/70 rounded-full flex items-center justify-center p-2 text-green-100">
                        <ArrowUp className="" /> <p>{growthRates.sales}%</p>
                      </div>
                    ) : (
                      <div className="bg-red-700/50 rounded-full flex items-center justify-center p-2 text-red-300">
                        <ArrowDown className="" /> <p>{growthRates.sales}%</p>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>
                <h3 className="font-header">{data.sandR[0].sales} Sales</h3>
              </div>
              <div className="flex items-center justify-center rounded-md bg-secondary text-secondary-foreground relative h-24 md:h-auto">
                <div className="absolute top-3 right-3">
                  {growthRates.revenue ? (
                    growthRates.revenue > 0 ? (
                      <div className="bg-green-700/80 rounded-full flex items-center justify-center p-2 text-white">
                        <ArrowUp className="" /> <p>{growthRates.revenue}%</p>
                      </div>
                    ) : (
                      <div className="bg-red-700/50 rounded-full flex items-center justify-center p-2 text-red-200">
                        <ArrowDown className="" /> <p>{growthRates.revenue}%</p>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>

                <h3 className="font-header">
                  {data.sandR[0].revenue} Birr Revenue
                </h3>
              </div>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
