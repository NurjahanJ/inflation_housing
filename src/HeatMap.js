// src/HeatMap.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const HeatMap = () => {
  const containerRef = useRef(null);
  const d3Container = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get container dimensions from CSS
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Clear any existing SVG content before redrawing
    d3.select(d3Container.current).selectAll('*').remove();

    // Define margins and drawing area dimensions
    const margin = { top: 80, right: 50, bottom: 60, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Create the SVG element
    const svg = d3.select(d3Container.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Load and parse the CSV data
    d3.csv(process.env.PUBLIC_URL + '/HeatMap_data.csv')
      .then(rawData => {
        if (!rawData || rawData.length === 0) {
          console.error('Error: CSV data is empty or missing.');
          return;
        }

        setData(rawData); // Save data for debugging

        // Get unique years from the data
        const years = [...new Set(rawData.map(d => d.Year))];

        // Define the cities based on the column headers
        const cities = ["Los Angeles", "Phoenix", "San Diego", "Seattle", "San Francisco"];

        // Flatten the data into an array of {year, city, value}
        const heatData = [];
        rawData.forEach(d => {
          cities.forEach(city => {
            const value = +d[`HPI Change (%) - ${city}`]; // Convert to number
            if (!isNaN(value)) {
              heatData.push({ year: d.Year, city, value });
            }
          });
        });

        // If heatData is empty, log an error
        if (heatData.length === 0) {
          console.error('Error: Heatmap data is not formatted correctly or missing.');
          return;
        }

        // X-scale (Years)
        const xScale = d3.scaleBand()
          .domain(years)
          .range([0, width])
          .padding(0.05);

        // Y-scale (Cities)
        const yScale = d3.scaleBand()
          .domain(cities)
          .range([0, height])
          .padding(0.05);

        // Color scale
        const minValue = d3.min(heatData, d => d.value);
        const maxValue = d3.max(heatData, d => d.value);
        const colorScale = d3.scaleSequential()
          .interpolator(d3.interpolateYlOrRd)
          .domain([minValue, maxValue]);

        // X-axis (Years)
        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickSize(0))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

        // Y-axis (Cities)
        svg.append('g')
          .call(d3.axisLeft(yScale).tickSize(0));

        // Chart title
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', -margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .text('II. Cities Where Housing Prices Increased Most');

        // Draw heatmap cells
        svg.selectAll("rect.cell")
          .data(heatData, d => `${d.city}:${d.year}`)
          .enter()
          .append('rect')
          .attr('class', 'cell')
          .attr('x', d => xScale(d.year))
          .attr('y', d => yScale(d.city))
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .style('fill', d => colorScale(d.value) || '#ccc') // Default color for missing values
          .style('stroke', 'white');

        // Tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "heatmap-tooltip")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background", "#fff")
          .style("border", "1px solid #ccc")
          .style("padding", "5px");

        svg.selectAll("rect.cell")
          .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
              .html(`Year: ${d.year}<br/>City: ${d.city}<br/>HPI Change: ${d.value.toFixed(2)}%`);
          })
          .on("mousemove", function(event) {
            tooltip.style("top", `${event.pageY + 5}px`)
              .style("left", `${event.pageX + 5}px`);
          })
          .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
          });
      })
      .catch(error => console.error('Error loading CSV:', error));
  }, []);

  return (
    <div className="heatmap-container" ref={containerRef}>
      <svg ref={d3Container}></svg>
    </div>
  );
};

export default HeatMap;
