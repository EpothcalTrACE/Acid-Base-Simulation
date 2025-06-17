// visualization.js
import * as d3 from 'd3';

export function renderCharts(data) {
    const container = d3.select('#visualization-container');
    container.html(''); // Clear previous content

    // Dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };

    // Scales
    const xScale = d3.scaleLinear().domain([0, d3.max(data, d => d.time)]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height - margin.bottom, margin.top]);

    // Line Generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    // SVG Container
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // X-Axis
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0));

    // Y-Axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`) 
        .call(d3.axisLeft(yScale));

    // Line Path
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#4CAF50')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

    // Tooltip
    const tooltip = container.append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', '#fff')
        .style('padding', '5px')
        .style('border', '1px solid #ddd');

    svg.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.time))
        .attr('cy', d => yScale(d.value))
        .attr('r', 4)
        .attr('fill', '#2196F3')
        .on('mouseover', (event, d) => {
            tooltip.style('opacity', 1)
                .html(`Time: ${d.time} <br> Value: ${d.value}`)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 20}px`);
        })
        .on('mouseout', () => tooltip.style('opacity', 0));

    // Zooming feature
    const zoom = d3.zoom().scaleExtent([1, 5]).on('zoom', (event) => {
        svg.attr('transform', event.transform);
    });

    svg.call(zoom);
}
