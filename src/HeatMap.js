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
          .attr('y', -margin.top / 2 - 20) // moved up by 10px
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .style('font-family', "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style('fill', 'black')
          .text('II. Cities Where Housing Prices Increased Most');

        // Legend group (positioned under the title)
        const legendHeight = 15;
        const legendWidth = 200;
        const legendX = width / 2 - legendWidth / 2;
        const legendY = -margin.top / 2.5 - .3; // Adjust this value as needed

        // Define a linear gradient for the legend
        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient")
          .attr("id", "legend-gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");

        linearGradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", colorScale(minValue));
        linearGradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colorScale(maxValue));

        // Append legend rectangle using the gradient
        svg.append("rect")
          .attr("x", legendX)
          .attr("y", legendY)
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .style("fill", "url(#legend-gradient)")
          .style("stroke", "black");

        // Append min value label
        svg.append("text")
          .attr("x", legendX)
          .attr("y", legendY + legendHeight + 15)
          .attr("text-anchor", "start")
          .style("font-size", "12px")
          .style("font-family", "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style("fill", "black")
          .text(minValue.toFixed(2) + "%");

        // Append max value label
        svg.append("text")
          .attr("x", legendX + legendWidth)
          .attr("y", legendY + legendHeight + 15)
          .attr("text-anchor", "end")
          .style("font-size", "12px")
          .style("font-family", "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style("fill", "black")
          .text(maxValue.toFixed(2) + "%");

        // Optional: Legend title
        svg.append("text")
          .attr("x", legendX + legendWidth / 2)
          .attr("y", legendY - 5)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-family", "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace")
          .style("fill", "black")
          .text("HPI Change (%)");

        // Draw rectangles for each cell (assign class "cell")
        svg.selectAll("rect.cell")
          .data(heatData, d => d.city + ':' + d.year)
          .enter()
          .append('rect')
          .attr('class', 'cell')
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

        // Attach tooltip events only to heatmap cells
        svg.selectAll("rect.cell")
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
