import { PerformanceMetric } from "./types";

// localStorage keys
export const STORAGE_KEYS = {
  CRYPTO_DATA: "crypto_performance_data",
  SELECTED_METRIC: "selected_performance_metric",
  LAST_FETCH_TIME: "last_crypto_data_fetch_time",
};

export const CACHE_EXPIRY_TIME = 30 * 60 * 1000;

export const formatMetricName = (metric: PerformanceMetric): string => {
  const metricLabels: Record<PerformanceMetric, string> = {
    perf_24h: "24-Hour Performance",
    perf_7d: "7-Day Performance",
    perf_30d: "30-Day Performance",
    perf_90d: "90-Day Performance",
  };

  return metricLabels[metric];
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const getPerformanceColorClass = (value: number): string => {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-gray-600";
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

export const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_EXPIRY_TIME;
};

export const truncateText = (text: string, maxLength: number = 12): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
