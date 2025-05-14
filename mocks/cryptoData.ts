import { IDataDTO } from "../lib/types";

const cryptocurrencyNames = [
  "Bitcoin",
  "Ethereum",
  "Binance Coin",
  "Cardano",
  "Solana",
  "XRP",
  "Polkadot",
  "Dogecoin",
  "Avalanche",
  "Polygon",
  "Chainlink",
  "Litecoin",
  "Bitcoin Cash",
  "Algorand",
  "Stellar",
  "VeChain",
  "TRON",
  "Ethereum Classic",
  "Monero",
  "Cosmos",
];

// Generate cryptocurrency names for 5000 items
const generateCryptoNames = (count: number): string[] => {
  const result: string[] = [];

  // First, use the base list
  result.push(...cryptocurrencyNames);

  // Then generate random names for remaining items
  const baseCount = cryptocurrencyNames.length;
  for (let i = baseCount; i < count; i++) {
    if (i < baseCount * 10) {
      // Combine existing names with numbers
      const baseName = cryptocurrencyNames[i % baseCount];
      const number = Math.floor(i / baseCount) + 1;
      result.push(`${baseName} ${number}`);
    } else {
      // Generate completely random names for remaining items
      result.push(`Crypto${i}`);
    }
  }

  return result;
};

// Generate complete data for 5000 cryptocurrencies
export const generateFullCryptoData = (count: number = 5000): IDataDTO[] => {
  const names = generateCryptoNames(count);

  // Random arrays with different distributions for each performance metric
  const seedFactors = Array.from({ length: 4 }, () => Math.random() * 100);

  return names.map((name, index) => {
    // Create different values for each cryptocurrency using multiple pattern combinations
    const perf24h = calculateDiversePerformance(index, 1, seedFactors[0]);
    const perf7d = calculateDiversePerformance(index, 1.5, seedFactors[1]);
    const perf30d = calculateDiversePerformance(index, 2, seedFactors[2]);
    const perf90d = calculateDiversePerformance(index, 3, seedFactors[3]);

    return {
      cryptocurrency: name,
      perf_24h: perf24h,
      perf_7d: perf7d,
      perf_30d: perf30d,
      perf_90d: perf90d,
    };
  });
};

// New function to calculate diverse performance values
function calculateDiversePerformance(
  index: number,
  volatilityFactor: number,
  seed: number
): number {
  // Combine multiple patterns for greater diversity

  // Sine pattern with different frequency
  const sinPattern = Math.sin(index * 0.13 + seed) * 12;

  // Cosine pattern with another frequency
  const cosPattern = Math.cos(index * 0.07 + seed * 0.5) * 10;

  // Exponential pattern for generating some larger values
  const expPattern = (Math.exp(Math.sin(index * 0.01)) - 1) * 5;

  // Gaussian random distribution (using Box-Muller algorithm)
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const gaussianRandom =
    Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * 5;

  // Combine all patterns with different weights
  const combinedPattern =
    sinPattern * 0.3 +
    cosPattern * 0.3 +
    expPattern * 0.2 +
    gaussianRandom * 0.2 +
    (Math.random() * 10 - 5); // Add some random noise

  // Apply volatility factor and limit to logical range
  const scaledValue = combinedPattern * volatilityFactor;

  // Limit values to logical range (-50 to +50 percent)
  const clampedValue = Math.max(Math.min(scaledValue, 50), -50);

  // Round to two decimal places
  return parseFloat(clampedValue.toFixed(2));
}

// Helper function for artificial API delay
export const simulateApiDelay = (
  min: number = 100,
  max: number = 500
): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Paginate the data
export const paginateData = (data: IDataDTO[], page: number, size: number) => {
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const items = data.slice(startIndex, endIndex);
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / size);

  return {
    items,
    total: totalItems,
    page,
    size,
    pages: totalPages,
    links: {
      first: page > 1 ? `/api/crypto?page=1&size=${size}` : null,
      last:
        page < totalPages
          ? `/api/crypto?page=${totalPages}&size=${size}`
          : null,
      self: `/api/crypto?page=${page}&size=${size}`,
      next:
        page < totalPages ? `/api/crypto?page=${page + 1}&size=${size}` : null,
      prev: page > 1 ? `/api/crypto?page=${page - 1}&size=${size}` : null,
    },
  };
};
