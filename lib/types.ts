export interface IDataDTO {
  perf_24h: number;
  perf_7d: number;
  perf_30d: number;
  perf_90d: number;
  cryptocurrency: string;
}

export interface IPaginatedData {
  items: IDataDTO[];
  total: number;
  page: number;
  size: number;
  pages: number;
  links: {
    first: string | null;
    last: string | null;
    self: string | null;
    next: string | null;
    prev: string | null;
  };
}

export type PerformanceMetric =
  | "perf_24h"
  | "perf_7d"
  | "perf_30d"
  | "perf_90d";

export interface FetchResult {
  success: boolean;
  data?: IDataDTO[];
  error?: string;
}
