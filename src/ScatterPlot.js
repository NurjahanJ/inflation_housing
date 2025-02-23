// src/ScatterPlot.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = () => {
  const containerRef = useRef(null);
  const d3Container = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && d3Container.current) {
      // Get container dimensions from the CSS
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Clear any existing SVG content
      d3.select(d3Container.current).selectAll('*').remove();

      // Define margins and compute drawing area dimensions
      const margin = { top: 60, right: 30, bottom: 60, left: 70 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Create the SVG element with full container dimensions
      const svg = d3.select(d3Container.current)
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Load and parse the CSV data
      d3.csv(process.env.PUBLIC_URL + '/Scatter_Plot_data.csv').then(data => {
        // Expected columns:
        // Year, CPI Change (%) - Los Angeles, CPI Change (%) - Phoenix, CPI Change (%) - San Diego,
        // CPI Change (%) - Seattle, CPI Change (%) - San Francisco,
        // HPI - Los Angeles, HPI - Phoenix, HPI - San Diego, HPI - Seattle, HPI - San Francisco

        // Convert necessary fields to numbers
        data.forEach(d => {
          d.Year = +d.Year;
          d["CPI Change (%) - Los Angeles"] = +d["CPI Change (%) - Los Angeles"];
          d["CPI Change (%) - Phoenix"] = +d["CPI Change (%) - Phoenix"];
          d["CPI Change (%) - San Diego"] = +d["CPI Change (%) - San Diego"];
          d["CPI Change (%) - Seattle"] = +d["CPI Change (%) - Seattle"];
          d["CPI Change (%) - San Francisco"] = +d["CPI Change (%) - San Francisco"];
          d["HPI - Los Angeles"] = +d["HPI - Los Angeles"];
          d["HPI - Phoenix"] = +d["HPI - Phoenix"];
          d["HPI - San Diego"] = +d["HPI - San Diego"];
          d["HPI - Seattle"] = +d["HPI - Seattle"];
          d["HPI - San Francisco"] = +d["HPI - San Francisco"];
        });

        // Define the cities array
        const cities = ["Los Angeles", "Phoenix", "San Diego", "Seattle", "San Francisco"];

        // Flatten the data so each point represents a city in a given year
        const scatterData = [];
        data.forEach(d => {
          cities.forEach(city => {
            scatterData.push({
              year: d.Year,
              city: city,
              inflation: parseFloat(d[`CPI Change (%) - ${city}`]),
              hpi: parseFloat(d[`HPI - ${city}`])
            });
          });
        });

        // Create x-scale for inflation
        const xExtent = d3.extent(scatterData, d => d.inflation);
        const x = d3.scaleLinear()
          .domain([xExtent[0] * 0.95, xExtent[1] * 1.05])
          .range([0, width]);

        // Create y-scale for HPI
        const yExtent = d3.extent(scatterData, d => d.hpi);
        const yScale = d3.scaleLinear()
          .domain([yExtent[0] * 0.95, yExtent[1] * 1.05])
          .range([height, 0]);

        // Define a color scale for the cities
        const colorScale = d3.scaleOrdinal()
          .domain(cities)
          .range([
            "rgb(255, 99, 132)", 
            "rgb(54, 162, 235)", 
            "rgb(255, 206, 86)", 
            "rgb(75, 192, 192)", 
            "rgb(153, 102, 255)"
          ]);

        // Add x-axis
        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x).tickFormat(d3.format(".1f")));

        // x-axis label
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height + margin.bottom - 10)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-family', 'source-code-pro, Menlo, Monaco, Consolas, \'Courier New\', monospace')
          .text('Inflation Rate (CPI Change %)');

        // Add y-axis
        svg.append('g')
          .call(d3.axisLeft(yScale));

        // y-axis label
        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('x', -height / 2)
          .attr('y', -margin.left + 20)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-family', 'source-code-pro, Menlo, Monaco, Consolas, \'Courier New\', monospace')
          .text('Housing Price Index (HPI)');

        // Chart title
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', -margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .style('font-family', 'source-code-pro, Menlo, Monaco, Consolas, \'Courier New\', monospace')
          .text('III. Correlation Between Inflation (CPI) & Housing Prices (HPI)');

        // --- Legend for Scatter Plot ---
        // Legend group positioned under the title
        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${width / 2 - 140}, ${-margin.top / 2 + 20})`); // adjust x, y as needed

        // For each city, add a legend item (circle and text)
        cities.forEach((city, i) => {
          const legendItem = legend.append('g')
            .attr('transform', `translate(${i * 140}, 0)`);
          legendItem.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 4)
            .attr('fill', colorScale(city));
          legendItem.append('text')
            .attr('x', 8)
            .attr('y', 4)
            .style('font-size', '12px')
            .style('font-family', 'source-code-pro, Menlo, Monaco, Consolas, \'Courier New\', monospace')
            .style('fill', 'black')
            .text(city);
        });

        // Tooltip functionality
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background", "#fff")
          .style("border", "1px solid #ccc")
          .style("padding", "5px")
          .style("font-family", 'source-code-pro, Menlo, Monaco, Consolas, \'Courier New\', monospace')
          .style("font-size", "12px");

        // Plot scatter points and add hover events
        svg.selectAll('circle.data-point')
          .data(scatterData)
          .enter()
          .append('circle')
          .attr('class', 'data-point')
          .attr('cx', d => x(d.inflation))
          .attr('cy', d => yScale(d.hpi))
          .attr('r', 4)
          .attr('fill', d => colorScale(d.city))
          .attr('opacity', 0.8)
          .on('mouseover', function(event, d) {
            tooltip.style("visibility", "visible")
              .html(`City: ${d.city}<br/>Year: ${d.year}<br/>Inflation: ${d.inflation.toFixed(2)}%<br/>HPI: ${d.hpi.toFixed(2)}`);
          })
          .on('mousemove', function(event) {
            tooltip.style("top", (event.pageY + 5) + "px")
              .style("left", (event.pageX + 5) + "px");
          })
          .on('mouseout', function() {
            tooltip.style("visibility", "hidden");
          });
      });
    }
  }, []);

  return (
    <div className="scatterplot-container" ref={containerRef}>
      <svg ref={d3Container}></svg>
    </div>
  );
};

export default ScatterPlot;
