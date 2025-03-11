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

      // ✅ Corrected CSV file path (Ensure file is in /public/)
      d3.csv('/HeatMap_data.csv')
        .then(data => {
          if (!data || data.length === 0) {
            console.error("CSV data is empty or not loading properly.");
            return;
          }

          console.log("CSV Data Loaded:", data[0]); // Debugging CSV structure

          // ✅ Ensure column headers match your CSV file exactly
          const years = [...new Set(data.map(d => d.Year))];

          // ✅ Cities list (Check CSV headers)
          const cities = ["Los Angeles", "Phoenix", "San Diego", "Seattle", "San Francisco"];

          // ✅ Flatten the data into an array of { year, city, value }
          const heatData = [];
          data.forEach(d => {
            cities.forEach(city => {
              const columnName = `HPI Change (%) - ${city}`;
              const value = parseFloat(d[columnName]) || 0; // Ensure parsing

              heatData.push({
                year: d.Year,
                city: city,
                value: value
              });
            });
          });

          console.log("Processed HeatMap Data:", heatData); // Debugging transformed data

          // ✅ Scales
          const xScale = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.05);

          const yScale = d3.scaleBand()
            .domain(cities)
            .range([0, height])
            .padding(0.05);

          // ✅ Color Scale
          const minValue = d3.min(heatData, d => d.value);
          const maxValue = d3.max(heatData, d => d.value);

          const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateYlOrRd)
            .domain([minValue, maxValue]);

          // ✅ X-axis (Years)
          svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.5em")
            .attr("dy", "0.15em")
            .attr("transform", "rotate(-45)");

          // ✅ Y-axis (Cities)
          svg.append('g')
            .call(d3.axisLeft(yScale));

          // ✅ Title
          svg.append('text')
            .attr('x', width / 2)
            .attr('y', -margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('II. Cities Where Housing Prices Increased Most');

          // ✅ Heatmap Cells
          svg.selectAll("rect.cell")
            .data(heatData)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('x', d => xScale(d.year))
            .attr('y', d => yScale(d.city))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', d => colorScale(d.value))
            .style('stroke', 'white');

          // ✅ Tooltip
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
              tooltip
                .style("top", (event.pageY + 5) + "px")
                .style("left", (event.pageX + 5) + "px");
            })
            .on("mouseout", function() {
              tooltip.style("visibility", "hidden");
            });

        })
        .catch(error => {
          console.error("Error loading CSV file:", error);
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
