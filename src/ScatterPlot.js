// src/ScatterPlot.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      // Clear any previous SVG content
      d3.select(d3Container.current).selectAll('*').remove();

      // Define margins and dimensions
      const margin = { top: 40, right: 30, bottom: 60, left: 70 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create the SVG canvas and group element
      const svg = d3.select(d3Container.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Load CSV data from public folder
      d3.csv(process.env.PUBLIC_URL + '/Scatter_Plot_data.csv').then(data => {
        // Expected CSV columns:
        // Year, CPI Change (%) - Los Angeles, CPI Change (%) - Phoenix, CPI Change (%) - San Diego,
        // CPI Change (%) - Seattle, CPI Change (%) - San Francisco,
        // HPI - Los Angeles, HPI - Phoenix, HPI - San Diego, HPI - Seattle, HPI - San Francisco

        // Define the cities we care about
        const cities = ["Los Angeles", "Phoenix", "San Diego", "Seattle", "San Francisco"];

        // Flatten the CSV so that each data point represents one city in one year,
        // with inflation (x) and HPI (y)
        const scatterData = [];
        data.forEach(d => {
          cities.forEach(city => {
            scatterData.push({
              year: +d.Year,
              city: city,
              inflation: parseFloat(d[`CPI Change (%) - ${city}`]),
              hpi: parseFloat(d[`HPI - ${city}`])
            });
          });
        });

        // Create x-scale (inflation)
        const xExtent = d3.extent(scatterData, d => d.inflation);
        const x = d3.scaleLinear()
          .domain([xExtent[0] * 0.95, xExtent[1] * 1.05])
          .range([0, width]);

        // Create y-scale (housing price index)
        const yExtent = d3.extent(scatterData, d => d.hpi);
        const y = d3.scaleLinear()
          .domain([yExtent[0] * 0.95, yExtent[1] * 1.05])
          .range([height, 0]);

        // Append x-axis to the SVG
        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format(".1f")));

        // Append x-axis label
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height + margin.bottom - 10)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px', 'bold')
          .text('Inflation Rate (CPI Change %)');

        // Append y-axis to the SVG
        svg.append('g')
          .call(d3.axisLeft(y));

        // Append y-axis label
        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('x', -height / 2)
          .attr('y', -margin.left + 20)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px', 'bold')
          .text('Housing Price Index (HPI)');

        // Append chart title
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', -margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px', 'bold')
          .style('font-weight', 'bold')
          .text('Correlation Between Inflation & Housing Prices');

        // Define a color scale for cities
        const colorScale = d3.scaleOrdinal()
          .domain(cities)
          .range([
            "rgb(255, 99, 132)", 
            "rgb(54, 162, 235)", 
            "rgb(255, 206, 86)", 
            "rgb(75, 192, 192)", 
            "rgb(153, 102, 255)"
          ]);

        // Plot the scatter points
        svg.selectAll("circle")
          .data(scatterData)
          .enter()
          .append("circle")
          .attr("cx", d => x(d.inflation))
          .attr("cy", d => y(d.hpi))
          .attr("r", 4)
          .attr("fill", d => colorScale(d.city))
          .attr("opacity", 0.8);
      });
    }
  }, []);

  return <svg className="scatterplot-container" ref={d3Container}></svg>;
};

export default ScatterPlot;
