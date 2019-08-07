<template>
          <div id="d3" style="border: 1px solid black; width: 1200px; height: 800px"></div>
</template>

<script>
  import * as d3 from 'd3';
  import * as xapps from 'xapps-io-core-api';
  import * as cola from 'webcola';
  import { container } from 'xapps-io-core-api'

  console.log("container")
  console.log(container)

  var data;


  var height = 1200;
  var width = 1200;
  var color = d3.scaleOrdinal(d3.schemeCategory10);

          let chart = () => {
    const nodes = data.nodes.map(d => Object.create(d));
  const index = new Map(nodes.map(d => [d.id, d]));
  const links = data.links.map(d => Object.assign(Object.create(d), {
    source: index.get(d.source),
    target: index.get(d.target)
  }));

  const svg = d3.select('#d3').append('svg')
          .attr('width', width)
          .attr('height', height);

  const layout = cola.d3adaptor(d3)
          .size([width, height])
          .nodes(nodes)
          .links(links)
          .jaccardLinkLengths(40, 0.7)
          .start(30);

  const link = svg.append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("stroke-width", d => Math.sqrt(d.value));

  const nodeEnter = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()

  const node = nodeEnter.append("circle")
          .attr("r", 10)
          .attr("fill", d => color(d.group))
          .call(layout.drag);


  const text = nodeEnter.append("text")
      .attr("dx", d => d.x)
          .attr("dy", d => d.y)
          .attr("text-anchor", "start")
          .attr("fill","gray")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5)
          .text("1");

  node.append("title")
          .text(d => d.id);

  layout.on("tick", () => {
    link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

    node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

      text
          .attr("dx", d => d.x)
          .attr("dy", d => d.y);
  });

  // invalidation.then(() => layout.stop());


  }

  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: false,
    }),

    mounted: () => {
        xapps.rfcQuery({queryTable: 'T880'}).subscribe(res => console.log(res.data));
        xapps.ConsolidationCompany.getAll().subscribe(res => console.log(res));

        d3.json("https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json").then(
        res => {
          data = res;
          chart();
        }
      )

    }
  }
</script>
