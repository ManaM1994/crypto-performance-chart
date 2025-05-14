import {
  IDataDTO,
  IPaginatedData,
  FetchResult,
  PerformanceMetric,
} from "./types";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  STORAGE_KEYS,
  isCacheValid,
} from "./utils";

const CONCURRENT_REQUESTS = 5;

export async function fetchCryptoPage(
  page: number,
  size: number = 100
): Promise<IPaginatedData> {
  try {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer ? "http://localhost:3000" : "";
    const url = `${baseUrl}/api/crypto?page=${page}&size=${size}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching crypto page:", error);
    throw error;
  }
}

export async function fetchAllCryptoData(): Promise<FetchResult> {
  try {
    if (typeof window !== "undefined") {
      const cachedTimestamp = getFromLocalStorage<number>(
        STORAGE_KEYS.LAST_FETCH_TIME
      );
      const cachedData = getFromLocalStorage<IDataDTO[]>(
        STORAGE_KEYS.CRYPTO_DATA
      );

      if (
        cachedTimestamp &&
        cachedData &&
        cachedData.length > 0 &&
        isCacheValid(cachedTimestamp)
      ) {
        console.log("Using cached data...");
        return {
          success: true,
          data: cachedData,
        };
      }
    }

    const firstPage = await fetchCryptoPage(1);
    const totalPages = firstPage.pages;

    const allPageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    let allData: IDataDTO[] = [...firstPage.items];

    for (let i = 1; i < allPageNumbers.length; i += CONCURRENT_REQUESTS) {
      const batch = allPageNumbers.slice(i, i + CONCURRENT_REQUESTS);

      const batchResults = await Promise.all(
        batch.map((pageNum) => fetchCryptoPage(pageNum))
      );

      batchResults.forEach((result) => {
        allData = [...allData, ...result.items];
      });
    }

    if (typeof window !== "undefined") {
      saveToLocalStorage(STORAGE_KEYS.CRYPTO_DATA, allData);
      saveToLocalStorage(STORAGE_KEYS.LAST_FETCH_TIME, Date.now());
    }

    return {
      success: true,
      data: allData,
    };
  } catch (error) {
    console.error("Error fetching all crypto data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export function processData(
  data: IDataDTO[],
  metricType: PerformanceMetric,
  limit: number = 50
): IDataDTO[] {
  if (!data || data.length === 0) return [];

  const sortedData = [...data].sort((a, b) => {
    return b[metricType] - a[metricType];
  });

  const topData = sortedData.slice(0, limit);

  if (sortedData.length > limit) {
    const othersData = sortedData.slice(limit);

    const othersRecord: IDataDTO = {
      cryptocurrency: "Others",
      perf_24h: calculateAverage(othersData, "perf_24h"),
      perf_7d: calculateAverage(othersData, "perf_7d"),
      perf_30d: calculateAverage(othersData, "perf_30d"),
      perf_90d: calculateAverage(othersData, "perf_90d"),
    };

    topData.push(othersRecord);
  }

  return topData;
}

function calculateAverage(data: IDataDTO[], field: keyof IDataDTO): number {
  const sum = data.reduce((acc, item) => acc + Number(item[field]), 0);
  return parseFloat((sum / data.length).toFixed(2));
}
