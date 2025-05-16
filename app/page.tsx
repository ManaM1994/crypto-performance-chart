import { fetchAllCryptoData, processData } from "@/lib/api";
import { PerformanceMetric } from "@/lib/types";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ChartDataProvider from "@/components/ChartDataProvider";
import { ClientButton } from "@/components/common";

const TOP_CRYPTOS_COUNT = 50;
const DEFAULT_METRIC: PerformanceMetric = "perf_24h";

export default async function Home() {
  try {
    const result = await fetchAllCryptoData();

    if (!result.success || !result.data) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Error Fetching Data</h1>
          <p className="text-red-500">
            {result.error || "An unknown error has occurred"}
          </p>
          <ClientButton
            onClick={() => window.location.reload()}
            variant="primary"
            size="medium"
          >
            Try Again
          </ClientButton>
        </div>
      );
    }

    const processedData = processData(
      result.data,
      DEFAULT_METRIC,
      TOP_CRYPTOS_COUNT
    );

    return (
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">
            Cryptocurrency Performance Chart
          </h1>
          <p className="opacity-80">
            Compare the performance of top {TOP_CRYPTOS_COUNT} cryptocurrencies
            across different timeframes
          </p>
        </header>

        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          }
        >
          <ChartDataProvider initialData={processedData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    // Error handling
    console.error("Error in Home component:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Unexpected Error</h1>
        <p className="text-red-500">
          An error occurred while loading the data. Please try again.
        </p>
        <ClientButton
          onClick={() => window.location.reload()}
          variant="primary"
          size="medium"
        >
          Try Again
        </ClientButton>
      </div>
    );
  }
}
