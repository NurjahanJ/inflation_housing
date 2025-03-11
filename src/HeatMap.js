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

    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Clear previous SVG content
    d3.select(d3Container.current).selectAll('*').remove();

    // Define margins and dimensions
    const margin = { top: 80, right: 50, bottom: 60, left: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Create the SVG element
    const svg = d3.select(d3Container.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // ✅ Load CSV from public folder
    d3.csv('/HeatMap_data.csv')
      .then(rawData => {
        console.log("✅ CSV Loaded Successfully:", rawData);

        if (!rawData || rawData.length === 0) {
          console.error('❌ Error: CSV data is empty or missing.');
          return;
        }

        setData(rawData); // Save data for debugging

        // Get unique years
        const years = [...new Set(rawData.map(d => d.Year))];

        // Define cities based on column headers
        const cities = ["Los Angeles", "Phoenix", "San Diego", "Seattle", "San Francisco"];

        // Flatten data for D3
        const heatData = [];
        rawData.forEach(d => {
          cities.forEach(city => {
            const columnName = `HPI Change (%) - ${city}`; // Updated to match CSV
            const value = +d[columnName]; // Convert to number
            if (!isNaN(value)) {
              heatData.push({ year: d.Year, city, value });
            }
          });
        });

        // If heatData is empty, log an error
        if (heatData.length === 0) {
          console.error('❌ Error: Heatmap data is missing or formatted incorrectly.');
          return;
        }

        console.log("🔍 Processed Heat Data:", heatData);

        // Define scales
        const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.05);
        const yScale = d3.scaleBand().domain(cities).range([0, height]).padding(0.05);
        const minValue = d3.min(heatData, d => d.value);
        const maxValue = d3.max(heatData, d => d.value);
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([minValue, maxValue]);

        // X-axis
        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickSize(0))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

        // Y-axis
        svg.append('g').call(d3.axisLeft(yScale).tickSize(0));

        // Title
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', -margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .text('II. Cities Where Housing Prices Increased Most');

        // ✅ Test Rectangle (Remove After Debugging)
        svg.append("rect")
          .attr("x", 10)
          .attr("y", 10)
          .attr("width", 50)
          .attr("height", 50)
          .style("fill", "blue");

        // Draw heatmap
        svg.selectAll("rect.cell")
          .data(heatData, d => `${d.city}:${d.year}`)
          .enter()
          .append('rect')
          .attr('class', 'cell')
          .attr('x', d => xScale(d.year))
          .attr('y', d => yScale(d.city))
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .style('fill', d => colorScale(d.value) || '#ccc')
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
      .catch(error => console.error("❌ Error loading CSV:", error));

  }, []);

  return (
    <div className="heatmap-container" ref={containerRef}>
      <svg ref={d3Container}></svg>
    </div>
  );
};

export default HeatMap;
