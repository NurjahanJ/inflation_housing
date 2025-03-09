import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
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
          <li><a href="#chart-carousel">Charts</a></li>
          <li><a href="#dashboard-con">Conclusion</a></li>
          <li><a href="#map-section">Map</a></li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <section id="chart-carousel" className="chart-section">
          <Carousel showArrows={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
            <div className="carousel-item">
              <div className="chart-container">
                <LineChart />
              </div>
              <div className="explanation">
                <h2>Line Chart: Inflation Over Time</h2>
                <p>
                  The line chart illustrates the yearly trends of  inflation which is measured by changes in the Consumer Price Index (CPI) over the past decade.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <div className="chart-container">
                <HeatMap />
              </div>
              <div className="explanation">
                <h2>Heat Map: Cities Where Housing Prices Increased Most</h2>
                <p>
                  The heat map provides a regional perspective by displaying the intensity of housing price changes across various metropolitan areas over the past decade. Each cell represents the percentage change in home prices for a specific city and year, with darker colors indicating larger increases.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <div className="chart-container">
                <ScatterPlot />
              </div>
              <div className="explanation">
                <h2>Scatter Plot: Correlation Between Inflation & Housing Prices</h2>
                <p>
                  The scatter plot maps individual data points for various U.S. cities, with each point representing a specific year’s inflation rate and corresponding housing price index. A clear positive correlation is observed as most points trend upward, indicating that higher inflation rates are typically associated with higher housing prices.
                </p>
              </div>
            </div>
          </Carousel>
        </section>

        <section id="dashboard-con" className="dashboard-con">
          <h2>Conclusion</h2>
          <p>
            In summary, this dashboard provides a comprehensive view of the relationship between inflation and housing prices. The visualizations confirm that, on average, rising inflation is generally associated with higher housing prices, though the extent of this effect varies by region.
          </p>
        </section>

        <section id="map-section" className="chart-section">
          <div className="chart-container">
            <MapComponent />
          </div>
          <div className="explanation">
            <h2>Map: U.S. Cities Overview</h2>
            <p>
              The map provides a geographical perspective by marking key U.S. cities—Los Angeles, San Diego, San Francisco, Seattle, and Phoenix—with markers. It highlights Los Angeles, CA as the city with the most pronounced inflation-driven increase in housing prices.
            </p>
          </div>
        </section>
      </main>
      <footer id="dashboard-footer" className="dashboard-footer">
        <span className="text-muted">&copy; Nurjahan Jhorna, 2025 | All Rights Reserved | Data Dashboard</span>
      </footer>
    </div>
  );
}
export default App;
