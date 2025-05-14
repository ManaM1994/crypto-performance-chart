"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useChartStore } from "@/lib/store";
import LoadingSpinner from "./LoadingSpinner";
import ErrorFallback from "./ErrorFallback";
import { IDataDTO, PerformanceMetric } from "@/lib/types";
import { formatPercentage, truncateText } from "@/lib/utils";

// dynamic ECharts import to deny SSR Error
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-80 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
});

const METRIC_LABELS: Record<PerformanceMetric, string> = {
  perf_24h: "24-Hour Performance (%)",
  perf_7d: "7-Day Performance (%)",
  perf_30d: "30-Day Performance (%)",
  perf_90d: "90-Day Performance (%)",
};

const CryptoChart: React.FC = () => {
  const { data, selectedMetric, isLoading, error, setError } = useChartStore();
  const [chartInstance, setChartInstance] = useState<any>(null);

  const resetError = () => {
    setError(null);
  };

  const chartOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return {};
    }

    const sortedData = [...data].sort(
      (a, b) => b[selectedMetric] - a[selectedMetric]
    );

    const cryptoNames = sortedData.map((item) => item.cryptocurrency);
    const perfValues = sortedData.map((item) => item[selectedMetric]);

    const itemColors = perfValues.map((value) =>
      value >= 0 ? "#34D399" : "#EF4444"
    );

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const crypto = cryptoNames[dataIndex];
          const value = perfValues[dataIndex];
          const color = value >= 0 ? "#34D399" : "#EF4444";

          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${crypto}</div>
              <div style="display: flex; align-items: center;">
                <span style="color: ${color}; font-weight: bold;">${formatPercentage(
            value
          )}</span>
              </div>
            </div>
          `;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: cryptoNames,
        axisLabel: {
          interval: 0,
          rotate: 45,
          formatter: (value: string) => truncateText(value, 10),
          rich: {
            a: {
              lineHeight: 20,
              align: "center",
            },
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        name: METRIC_LABELS[selectedMetric],
        nameLocation: "middle",
        nameGap: 40,
        axisLabel: {
          formatter: "{value}%",
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            opacity: 0.5,
          },
        },
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 0,
          end: 100,
          height: 20,
          bottom: 0,
          borderColor: "rgba(17, 24, 39, 0.3)",
          handleStyle: {
            color: "#6366F1",
            borderColor: "#4F46E5",
          },
          textStyle: {
            color: "#374151",
          },
          brushSelect: true,
        },
        {
          type: "inside",
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
      ],
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "Zoom",
              back: "Back",
            },
          },
          restore: {
            title: "Reset",
          },
          saveAsImage: {
            title: "Save as Image",
          },
        },
      },
      series: [
        {
          name: METRIC_LABELS[selectedMetric],
          type: "bar",
          data: perfValues,
          itemStyle: {
            color: (params: any) => {
              return itemColors[params.dataIndex];
            },
            borderRadius: [3, 3, 0, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            show: false,
            position: "top",
            formatter: "{c}%",
          },
          barMaxWidth: "60%",
          barMinHeight: 5,

          animationDuration: 1000,
          animationEasing: "elasticOut",
        },
      ],
      responsive: true,
      maintainAspectRatio: false,
    };
  }, [data, selectedMetric]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption({
        yAxis: {
          name: METRIC_LABELS[selectedMetric],
        },
      });
    }
  }, [chartInstance, selectedMetric]);

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center bg-white rounded-lg shadow-md">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={error} resetAction={resetError} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No data available to display</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white transition-all duration-300 hover:shadow-lg">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Cryptocurrency Performance - {METRIC_LABELS[selectedMetric]}
        </h3>
        <div className="text-sm text-gray-500">Top 50 Coins + Others</div>
      </div>
      <ReactECharts
        option={chartOptions}
        style={{ height: "500px", width: "100%" }}
        className="crypto-chart"
        onChartReady={setChartInstance}
        opts={{ renderer: "canvas" }}
        notMerge={true}
        lazyUpdate={true}
      />
      <div className="mt-2 text-xs text-gray-500 text-center">
        Use mouse scroll or drag the slider below to zoom the chart
      </div>
    </div>
  );
};

export default CryptoChart;
