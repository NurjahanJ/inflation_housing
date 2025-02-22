// LineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  // Define your chart data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // x-axis labels
    datasets: [
      {
        label: 'Inflation Rate',
        data: [2.5, 3.0, 2.8, 3.2, 3.0, 2.7], // your data points
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Define chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inflation Rate Over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
