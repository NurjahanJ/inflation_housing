// src/LineChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Load the CSV file from the public folder
    Papa.parse(process.env.PUBLIC_URL + '/Line_chart_data.CVS', {
      download: true,
      header: true,
      complete: (results) => {
        // Assuming the CSV columns are:
        // Year, Los Angeles, Phoenix, San Diego, Seattle, San Francisco
        const data = results.data;

        // Extract the years for the x-axis
        const years = data.map(row => row.Year);

        // Define the cities and a color for each dataset
        const cities = ['Los Angeles', 'Phoenix', 'San Diego', 'Seattle', 'San Francisco'];
        const colors = {
          'Los Angeles': 'rgb(255, 99, 132)',
          'Phoenix': 'rgb(54, 162, 235)',
          'San Diego': 'rgb(255, 206, 86)',
          'Seattle': 'rgb(75, 192, 192)',
          'San Francisco': 'rgb(153, 102, 255)'
        };

        // Create a dataset for each city
        const datasets = cities.map(city => ({
          label: city,
          data: data.map(row => parseFloat(row[city])), // Convert string data to numbers
          fill: false,
          borderColor: colors[city],
          tension: 0.1
        }));

        // Update chart data state
        setChartData({
          labels: years,
          datasets: datasets
        });
      }
    });
  }, []);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Inflation Rate (2014-2024)' }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
