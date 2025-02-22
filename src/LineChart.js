// src/LineChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Load CSV file from public folder
    Papa.parse(process.env.PUBLIC_URL + '/Line_chart_data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        
        // Extract years for x-axis
        const years = data.map(row => row['Year']);

        // Define the cities and map to the respective CSV columns for CPI Change (inflation rate)
        const cities = [
          { label: "Los Angeles", key: "CPI Change (%) - Los Angeles", color: 'rgb(255, 99, 132)' },
          { label: "Phoenix", key: "CPI Change (%) - Phoenix", color: 'rgb(54, 162, 235)' },
          { label: "San Diego", key: "CPI Change (%) - San Diego", color: 'rgb(255, 206, 86)' },
          { label: "Seattle", key: "CPI Change (%) - Seattle", color: 'rgb(75, 192, 192)' },
          { label: "San Francisco", key: "CPI Change (%) - San Francisco", color: 'rgb(153, 102, 255)' },
        ];

        // Create datasets for each city
        const datasets = cities.map(city => ({
          label: city.label,
          data: data.map(row => parseFloat(row[city.key])),
          fill: false,
          borderColor: city.color,
          tension: 0.1,
        }));

        // Set the parsed data to the chartData state
        setChartData({
          labels: years,
          datasets: datasets,
        });
      }
    });
  }, []);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Inflation Rate (CPI Change %) 2014-2024' }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
