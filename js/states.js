


var width = 950;
var height = 800;
r0 = Math.min(width, height) * .35,
  r1 = r0 * 1.1;

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");



var matrix50x50 = [
  [18.31, 1.21, 0.14, 0.09, 0.04, 0.02, 0.76, 0.04],                            //Alabama
  [2.07, 18.93, 18.52, 4.27, 0.07, 0.01, 2.58, 0.17],                                                   //Alaska
  [0.00, 0.33, 11.69, 1.97, 0.02, 0.00, 4.49, 0.05],     //Arizona
  [0.0, 10.03, 1.90, 14.32, 0.34, 0.08, 0.21, 0.31],                                           //Arkansas
  [0.03, 0.10, 0.03, 0.29, 8.24, 0.01, 1.42, 1.24],   //California
  [0.48, 0.43, 1.16, 2.30, 0.20, 1.06, 2.89, 0.23],      //Colorado
  [4.94, 13.05, 11.20, 3.60, 4.98, 0.40, 41.86, 1.10],                                               //Connecticut
  [2.50, 2.79, 5.16, 10.24, 26.58, 0.52, 6.89, 1.37],                                                                            //Delaware

];

var range50 = ["#cd3d08", "#ec8f00", "#6DAE28", "#683f92", "#b60275", "#2058a5", "#00a592", "#378974"];

var chord = d3.layout.chord()
  .padding(.01)
  .sortSubgroups(d3.descending)
  .matrix(matrix50x50);

var fill = d3.scale.ordinal()
  .domain(d3.range(range50.length))
  .range(range50);


var innerRadius = Math.min(width, height) * .35;
var outerRadius = innerRadius * 1.1;
var range50_states = ["Saharan Africa", "Northern Africa and Western Asia", "Central and Southern Asia", "Eastern and South-Eastern Asia", "Latin America and the Caribbean", "Oceania", "Europe", "Northern America"];
svg.append("g")
  .selectAll("path")
  .data(chord.groups)
  .enter().append("path")
  .style("fill", function (d) {
    return fill(d.index);
  })
  .style("stroke", function (d) {
    return fill(d.index);
  })
  .on("mouseover", fade(.01))
  .on("mouseout", fade(1))
  .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
  .append("title").text(function (d, i) {
    return range50_states[d.index] + ": " + (d.value) + " Million";
  }).style("fill", "green");



var ticks = svg.append("g")
  .selectAll("g")
  .data(chord.groups)
  .enter().append("g")



// var range50_states = ["Alabma", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];



ticks.append("text")
  .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2; })
  .attr("dy", ".35em")
  .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
  .attr("transform", function (d) {
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
      + "translate(" + (r0 + 32) + ")"
      + (d.angle > Math.PI ? "rotate(180)" : "");
  })
  .text(function (d) { return range50_states[d.index]; })
  .on("mouseover", fade(.1))
  .on("mouseout", fade(1));

svg.append("g")
  .attr("class", "chord")
  .selectAll("path")
  .data(chord.chords)
  .enter().append("path")
  .style("fill", function (d) { return fill(d.target.index); })
  .attr("d", d3.svg.chord().radius(r0))
  .style("opacity", 1)
  // .append("title").text(function (d) {
  //   return range50_states[d.source.index].name
  //     + " → " + range50_states[d.target.index].name
  //     + ": " + (d.value)
  //     + "\n" + range50_states[d.target.index].name
  //     + " → " + range50_states[d.source.index].name
  //     + ": " + (d.value);
  // })
  ;

/** Returns an array of tick angles and labels, given a group. */
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, 1000).map(function (v, i) {
    return {
      angle: v * k + d.startAngle,
      label: i % 5 ? null : v / 1000 + "k"
    };
  });
}




function fade(opacity) {
  return function (g, i) {
    svg.selectAll("g.chord path")
      .filter(function (d) {
        return d.source.index != i && d.target.index != i;
      })
      .transition()
      .style("opacity", opacity);
  };
}
