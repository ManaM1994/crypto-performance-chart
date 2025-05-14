"use client";

import { useEffect, useState } from "react";
import { useChartStore } from "@/lib/store";
import CryptoChart from "./CryptoChart";
import TimeframeFilter from "./TimeframeFilter";
import LoadingSpinner from "./LoadingSpinner";
import { IDataDTO } from "@/lib/types";
import { Suspense } from "react";
import { formatPercentage, getPerformanceColorClass } from "@/lib/utils";

interface ChartDataProviderProps {
  initialData: IDataDTO[];
}

const ChartDataProvider: React.FC<ChartDataProviderProps> = ({
  initialData,
}) => {
  const { setData, setLoading, data, selectedMetric } = useChartStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setLoading(true);
    setData(initialData);
    setLoading(false);
    setIsInitialized(true);
  }, [initialData, setData, setLoading]);

  const stats = (() => {
    if (!data || data.length === 0) return { average: 0, max: 0, min: 0 };

    const values = data.map((crypto) => crypto[selectedMetric]);
    const validValues = values.filter((val) => !isNaN(val));

    return {
      average:
        validValues.reduce((sum, val) => sum + val, 0) / validValues.length,
      max: Math.max(...validValues),
      min: Math.min(...validValues),
    };
  })();

  return (
    <div className="space-y-6">
      <TimeframeFilter />

      {isInitialized && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Average Performance
            </h3>
            <p
              className={`text-2xl font-bold ${getPerformanceColorClass(
                stats.average
              )}`}
            >
              {formatPercentage(stats.average)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Best Performance
            </h3>
            <p
              className={`text-2xl font-bold ${getPerformanceColorClass(
                stats.max
              )}`}
            >
              {formatPercentage(stats.max)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Worst Performance
            </h3>
            <p
              className={`text-2xl font-bold ${getPerformanceColorClass(
                stats.min
              )}`}
            >
              {formatPercentage(stats.min)}
            </p>
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        }
      >
        <CryptoChart />
      </Suspense>
    </div>
  );
};

export default ChartDataProvider;
