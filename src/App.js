// src/App.js
import React from 'react';
import LineChart from './LineChart';
import ScatterPlot from './ScatterPlot';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Housing and Inflation Analysis</h1>
      <LineChart />
      <ScatterPlot />
    </div>
  );
}

export default App;
