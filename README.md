# Cryptocurrency Performance Chart

## Project Overview

This project fetches performance data for 5000 cryptocurrencies from a paginated API, extracts the top performers, and displays them in an interactive bar chart using ECharts. Users can dynamically switch between different time periods (24 hours, 7 days, 30 days, and 90 days).

## Technical Approach

### Data Fetching Structure

- Implementation of a simulated paginated API to mimic real-world scenarios
- Development of `fetchAllCryptoData` function for data retrieval and aggregation
- Utilization of Next.js Server Components for server-side data fetching

### Concurrent Request and Pagination Management

- Implementation of concurrency control mechanisms to prevent server overload
- Execution of requests in small batches of 5 for optimal balance between speed and reliability
- Integration of error handling and retry mechanisms

### Data Aggregation and Sampling

- Display of only the top 50 cryptocurrencies based on selected performance metrics
- Aggregation of remaining data into an "Others" category to maintain balance between detail and chart readability

### Performance Optimization and Prevention of Unnecessary Re-renders

- Use of useMemo for expensive computations
- Implementation of debouncing for time filter changes
- Leveraging Suspense and loading states for improved user experience

### Caching and Memoization

- Storage of fetched data in Zustand store for application state management
- Utilization of localStorage for temporary data caching to reduce redundant requests

## Challenges and Trade-offs

To prevent loading large amounts of data on the client side, data processing is performed server-side, extracting only the top 50 cryptocurrencies. This represents a trade-off between full zoom flexibility and initial rendering time. However, the ability to explore the "Others" category could be added in future versions.

Another challenge was managing concurrent requests. Finding the balance between speed and server load required careful testing to determine the optimal batch size (5 requests).

## How to Run the Project Locally

1. Clone the repository
2. install dependencies: ( npm install)
3. Run the development server (npm run dev)
4. Visit http://localhost:3000

## Bonus Implementations

> Added loading spinners and error notifications
> Implemented zooming and panning on the chart
> Implemented data caching to session storage
