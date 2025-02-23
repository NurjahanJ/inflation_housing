// src/App.js
import React from 'react';
import LineChart from './LineChart';
import HeatMap from './HeatMap';
import ScatterPlot from './ScatterPlot'

function App() {
  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <LineChart />
      </div>
      <div className="heatmap-container">
        <HeatMap />
      </div>
      <ScatterPlot />
    </div>
  );
}

export default App;
