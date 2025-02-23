// src/HeatMap.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HeatMap = () => {
  const containerRef = useRef(null);
  const d3Container = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && d3Container.current) {
      // Get container dimensions from CSS
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Clear any existing SVG content
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
      d3.csv(process.env.PUBLIC_URL + '/HeatMap_data.csv').then(data => {
        // Example columns:
        // Year, HPI Change (%) - Los Angeles, HPI Change (%) - Phoenix,
        // HPI Change (%) - San Diego, HPI Change (%) - Seattle, HPI Change (%) - San Francisco

        // Get unique years from the data
        const years = [...new Set(data.map(d => d.Year))];

        // Define the cities (must match the column suffixes in your CSV)
        const cities = ["Los Angeles", "Phoenix", "San Diego", "Seattle", "San Francisco"];

        // Flatten the data into an array of {year, city, value}
        const heatData = [];
        data.forEach(d => {
          cities.forEach(city => {
            heatData.push({
              year: d.Year,
              city: city,
              value: +d[`HPI Change (%) - ${city}`] // parse to number
            });
          });
        });

        // x-scale (Years) using scaleBand
        const xScale = d3.scaleBand()
          .domain(years)
          .range([0, width])
          .padding(0.05);

        // y-scale (Cities) using scaleBand
        const yScale = d3.scaleBand()
          .domain(cities)
          .range([0, height])
          .padding(0.05);

        // Determine min/max to set the color scale domain
        const minValue = d3.min(heatData, d => d.value);
        const maxValue = d3.max(heatData, d => d.value);

        // Sequential color scale
        const colorScale = d3.scaleSequential()
          .interpolator(d3.interpolateYlOrRd)
          .domain([minValue, maxValue]);

        // X-axis (Years)
        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .style("font-family", "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style("fill", "black")
          // Rotate labels -45 degrees to prevent overlap
          .style("text-anchor", "end")
          .attr("dx", "-0.5em")
          .attr("dy", "0.15em")
          .attr("transform", "rotate(-45)");

        // Y-axis (Cities)
        svg.append('g')
          .call(d3.axisLeft(yScale))
          .selectAll("text")
          .style("font-family", "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style("fill", "black");

        // Chart title
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', -margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .style('font-family', "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style('fill', 'black')
          .text('II. Cities Where Housing Prices Increased Most');

        // Draw rectangles for each cell
        svg.selectAll()
          .data(heatData, d => d.city + ':' + d.year)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.year))
          .attr('y', d => yScale(d.city))
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .style('fill', d => colorScale(d.value))
          .style('stroke', 'white');

        // Tooltip (Optional)
        const tooltip = d3.select("body").append("div")
          .attr("class", "heatmap-tooltip")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background", "#fff")
          .style("border", "1px solid #ccc")
          .style("padding", "5px")
          .style("font-family", "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style("font-size", "12px");

        svg.selectAll("rect")
          .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
              .html(`Year: ${d.year}<br/>City: ${d.city}<br/>HPI Change: ${d.value.toFixed(2)}%`);
          })
          .on("mousemove", function(event) {
            tooltip
              .style("top", (event.pageY + 5) + "px")
              .style("left", (event.pageX + 5) + "px");
          })
          .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
          });
      });
    }
  }, []);

  return (
    <div className="heatmap-container" ref={containerRef}>
      <svg ref={d3Container}></svg>
    </div>
  );
};

export default HeatMap;
