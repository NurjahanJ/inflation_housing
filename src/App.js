// src/App.js
import React from 'react';
import LineChart from './LineChart';
import HeatMap from './HeatMap';
import ScatterPlot from './ScatterPlot';
import MapComponent from './MapComponent';
import './App.css';
function App() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Inflation & Housing Dashboard</h1>
        <p>
          What is the relationship between inflation and house prices? If inflation increases, does housing price also increase?
        </p>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li><a href="#line-chart-section">Line Chart</a></li>
          <li><a href="#heatmap-section">Heat Map</a></li>
          <li><a href="#scatter-plot-section">Scatter Plot</a></li>
          <li><a href="#dashboard-con">Conclusion</a></li>
          <li><a href="#map-section">Map</a></li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <section id="line-chart-section" className="chart-section">
          <div className="chart-container">
            <LineChart />
          </div>
          <div className="explanation">
            <h2>Line Chart: Inflation vs. Housing Prices Over Time</h2>
            <p>
              The line chart illustrates the yearly trends of both inflation—measured by changes in the Consumer Price Index (CPI)—and housing prices over the past decade. When inflation rises, housing prices tend to follow an upward trajectory, suggesting a positive relationship between the two metrics. Peaks in inflation often align with spikes in the housing price index, indicating that increased inflation can drive higher home prices. Although the trends are not perfectly synchronous, this visualization demonstrates that rising inflation generally correlates with an increase in housing prices over time. Overall, the chart supports the idea that higher inflation is associated with rising home prices.
            </p>
          </div>
        </section>
        <section id="heatmap-section" className="chart-section">
          <div className="chart-container">
            <HeatMap />
          </div>
          <div className="explanation">
            <h2>Heat Map: Cities Where Housing Prices Increased Most</h2>
            <p>
              The heat map provides a regional perspective by displaying the intensity of housing price changes across various metropolitan areas over the past decade. Each cell represents the percentage change in home prices for a specific city and year, with darker colors indicating larger increases. This visualization clearly highlights which cities have experienced the most dramatic price hikes, suggesting that local economic factors also play a role. The heat map reinforces the overall positive relationship by showing that regions with higher inflationary pressures tend to see more significant increases in housing prices. Overall, it supports the idea that rising inflation is generally associated with increased home prices in key metropolitan areas.
            </p>
          </div>
        </section>
        <section id="scatter-plot-section" className="chart-section">
          <div className="chart-container">
            <ScatterPlot />
          </div>
          <div className="explanation">
            <h2>Scatter Plot: Correlation Between Inflation & Housing Prices</h2>
            <p>
              The scatter plot maps individual data points for various U.S. cities, with each point representing a specific year’s inflation rate and corresponding housing price index. A clear positive correlation is observed as most points trend upward, indicating that higher inflation rates are typically associated with higher housing prices. While city-specific factors introduce some variability, the overall pattern reinforces that increased inflation is generally linked to rising home prices. This graph effectively demonstrates that, on average, as inflation increases, housing prices tend to follow suit. Thus, the scatter plot supports the notion of a positive relationship between inflation and housing prices.
            </p>
          </div>
        </section>

        <section id="dashboard-con" className="dashboard-con">
        <h2>Conclusion</h2>
        <p>
          In summary, the dashboard provides a comprehensive view of the relationship between inflation and housing prices. The line chart shows a general upward trend in both inflation and housing prices over time, while the scatter plot reveals a strong positive correlation across different cities. The heat map further emphasizes regional differences by pinpointing areas with the most dramatic home price increases. The map adds geographic context by marking key cities and highlighting Los Angeles as the most affected. Together, these visualizations confirm that, on average, rising inflation is generally associated with higher housing prices, though the extent of this effect varies by region.
        </p>
        </section>

        <section id="map-section" className="chart-section">
          <div className="chart-container">
            <MapComponent />
          </div>
          <div className="explanation">
            <h2>Map: U.S. Cities Overview</h2>
            <p>
              The map provides a geographical perspective by marking key U.S. cities—Los Angeles, San Diego, San Francisco, Seattle, and Phoenix—with markers. It highlights Los Angeles, CA as the city with the most pronounced inflation-driven increase in housing prices, as indicated by its distinct marker. This integration of spatial data complements the other visualizations by linking economic trends to specific regions. Users can interact with the map to see details for each city, enhancing the understanding of regional variations. Overall, the map adds a valuable geographic context to the relationship between inflation and housing prices.
          </p>
          </div>
        </section>

        
      </main>
      
      <footer id="dashboard-footer" className="dashboard-footer">
        <span class="text-muted">&copy; Nurjahan Jhorna, 2025 |  All Rights Reserved  |  Data Dashboard</span>
      </footer>
    </div>
  );
}
export default App;
