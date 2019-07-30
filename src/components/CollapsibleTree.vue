<template>
    <div id="collapsible" style="width: 1200px; height:1200px"></div>
</template>

<script>
    import { default as sampleOrg } from './sampleOrg';

    import * as d3 from 'd3';


    export default {
        data: () => ({
            graphData: {}
        }),
        props: {

        },
        methods: {
            chart : function()  {

                const margin = ({top: 120, right: 200, bottom: 120, left: 200});
                const width = 1200;
                let dy = width / 4;
                let dx = dx = 120;
                const tree = d3.tree().nodeSize([dx, dy]);
                const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);


                const root = d3.hierarchy(this.graphData);

                root.x0 = dy / 2;
                root.y0 = 0;
                root.descendants().forEach((d, i) => {
                    d.id = i;
                    d._children = d.children;
                    if (d.depth && d.data.type.length !== 7) d.children = null;
                });

                const svg = d3.select('#collapsible').append("svg")
                    .attr("viewBox", [-margin.left, -margin.top, width, dx])
                    .style("font", "20px sans-serif")
                    .style("user-select", "none");

                const gLink = svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke", "#555")
                    .attr("stroke-opacity", 0.4)
                    .attr("stroke-width", 1.5);

                const gNode = svg.append("g")
                    .attr("cursor", "pointer")
                    .attr("pointer-events", "all");

                function update(source) {
                    const duration = d3.event && d3.event.altKey ? 2500 : 250;
                    const nodes = root.descendants().reverse();
                    const links = root.links();

                    // Compute the new tree layout.
                    tree(root);

                    let left = root;
                    let right = root;
                    root.eachBefore(node => {
                        if (node.x < left.x) left = node;
                        if (node.x > right.x) right = node;
                    });

                    const height = right.x - left.x + margin.top + margin.bottom;

                    const transition = svg.transition()
                        .duration(duration)
                        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
                        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

                    // Update the nodes…
                    const node = gNode.selectAll("g")
                        .data(nodes, d => d.id);

                    // Enter any new nodes at the parent's previous position.
                    const nodeEnter = node.enter().append("g")
                        .attr("transform", d => `translate(${source.y0},${source.x0})`)
                        .attr("fill-opacity", 0)
                        .attr("stroke-opacity", 0)
                        .on("click", d => {
                            d.children = d.children ? null : d._children;
                            update(d);
                        });

                    nodeEnter.append("circle")
                        .attr("r", 25)
                        .attr("fill", d => (d.data.type === "Company") ? "#12a9ff" :
                            (d.data.type === "CompanyCode") ? "#25802d" :
                                (d.data.type === "Plant") ? "orange" : "green")
                        .attr("stroke-width", 7)
                        .attr("stroke", "#414141");

                    nodeEnter.append("text")
                        .attr("dy", "-1.2em")
                        .attr("x", d => d._children ? -40 : 40)
                        .attr("text-anchor", d => d._children ? "end" : "start")
                        .attr("font-size","12")
                        .text(d => d.data.type)
                    // .clone(true).lower()
                    // .attr("stroke-linejoin", "round")
                    // .attr("stroke-width", 3)
                    // .attr("stroke", "white");

                    nodeEnter.append("text")
                        .attr("dy", "0em")
                        .attr("x", d => d._children ? -40 : 40)
                        .attr("text-anchor", d => d._children ? "end" : "start")
                        .attr("font-size","12")
                        .text(d => d.data.content)
                    // .clone(true).lower()
                    // .attr("stroke-linejoin", "round")
                    // .attr("stroke-width", 3)
                    // .attr("stroke", "white");

                    nodeEnter.append("text")
                        .attr("dy", "1.2em")
                        .attr("x", d => d._children ? -40 : 40)
                        .attr("text-anchor", d => d._children ? "end" : "start")
                        .attr("font-size","12")
                        .text(d => "Duration: " + d.data.duration)
                    // .clone(true).lower()
                    // .attr("stroke-linejoin", "round")
                    // .attr("stroke-width", 3)
                    // .attr("stroke", "white")
                    ;

                    nodeEnter.append("text")
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("class", "fas")
                        .attr("fill","white")
                        .text(d => (d.data.type === "Company") ? "\uf594" :
                            (d.data.type === "CompanyCode") ? "\uf64f" :
                                (d.data.type === "Plant") ? "\uf494" : "\uf1ad");

                    // Transition nodes to their new position.
                    const nodeUpdate = node.merge(nodeEnter).transition(transition)
                        .attr("transform", d => `translate(${d.y},${d.x})`)
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    const nodeExit = node.exit().transition(transition).remove()
                        .attr("transform", d => `translate(${source.y},${source.x})`)
                        .attr("fill-opacity", 0)
                        .attr("stroke-opacity", 0);

                    // Update the links…
                    const link = gLink.selectAll("path")
                        .data(links, d => d.target.id);

                    // Enter any new links at the parent's previous position.
                    const linkEnter = link.enter().append("path")
                        .attr("d", d => {
                            const o = {x: source.x0, y: source.y0};
                            return diagonal({source: o, target: o});
                        });

                    // Transition links to their new position.
                    link.merge(linkEnter).transition(transition)
                        .attr("d", diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition(transition).remove()
                        .attr("d", d => {
                            const o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o});
                        });

                    // Stash the old positions for transition.
                    root.eachBefore(d => {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                update(root);
            }
        },
        mounted() {
            /*d3.json("https://api.myjson.com/bins/11bvq3").then(res => {
                data = res;
                chart();
            })*/
            this.graphData = sampleOrg;// .default;
            //data = sampleOrg; //.default;
            this.chart();
        }
    }
</script>
