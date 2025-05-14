import { create } from "zustand";
import { IDataDTO, PerformanceMetric } from "./types";

interface ChartState {
  data: IDataDTO[];
  isLoading: boolean;
  error: string | null;
  selectedMetric: PerformanceMetric;
  displayLimit: number;
  setData: (data: IDataDTO[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedMetric: (metric: PerformanceMetric) => void;
  setDisplayLimit: (limit: number) => void;
  reset: () => void;
}

const initialState = {
  data: [],
  isLoading: false,
  error: null,
  selectedMetric: "perf_24h" as PerformanceMetric,
  displayLimit: 50,
};

export const useChartStore = create<ChartState>((set) => ({
  ...initialState,

  setData: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedMetric: (selectedMetric) => set({ selectedMetric }),
  setDisplayLimit: (displayLimit) => set({ displayLimit }),

  reset: () => set(initialState),
}));
