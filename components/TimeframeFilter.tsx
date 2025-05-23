"use client";

import React, { useCallback } from "react";
import { PerformanceMetric } from "@/lib/types";
import { useChartStore } from "@/lib/store";
import { ClientButton } from "@/components/common";

interface TimeframeOption {
  value: PerformanceMetric;
  label: string;
}

// Time frame filters
const timeframeOptions: TimeframeOption[] = [
  { value: "perf_24h", label: "24 Hours" },
  { value: "perf_7d", label: "7 Days" },
  { value: "perf_30d", label: "30 Days" },
  { value: "perf_90d", label: "90 Days" },
];

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const TimeframeFilter: React.FC = () => {
  const { selectedMetric, setSelectedMetric } = useChartStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetMetric = useCallback(
    debounce((metric: PerformanceMetric) => {
      setSelectedMetric(metric);
    }, 300),
    [setSelectedMetric]
  );

  const handleButtonClick = (metric: PerformanceMetric) => {
    debouncedSetMetric(metric);
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Performance Timeframe
      </h3>
      <div className="flex flex-wrap gap-2">
        {timeframeOptions.map((option) => (
          <ClientButton
            key={option.value}
            onClick={() => handleButtonClick(option.value)}
            variant={selectedMetric === option.value ? "primary" : "secondary"}
            size="medium"
          >
            {option.label}
          </ClientButton>
        ))}
      </div>
    </div>
  );
};

export default TimeframeFilter;
