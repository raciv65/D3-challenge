// @TODO: YOUR CODE HERE!

//Size for SVG and margin
let svgWidth=960;
let svgHeight=500;

var margin={
    top:20,
    right:40,
    bottom:80,
    left:100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg=d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("heigth", svgHeight+40);

var chartGroup=svg.append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`)

// Import data
d3.csv("assets/data/data.csv").then(function(csvData){
  console.log(csvData)
  //Parse data as numbers
  csvData.forEach(function(data) {
    data.poverty=+data.poverty;
    data.healthcare=+data.healthcare;
  });
  
  //Create scale functions
  // X-axis
  var xLinearScale=d3.scaleLinear()
    .domain([d3.min(csvData, d=>d.poverty)*0.9,d3.max(csvData, d=>d.poverty)*1.1])
    .range([0, width]);
  //Y-axis
  var yLinearScale=d3.scaleLinear()
    .domain([d3.min(csvData, d=>d.healthcare)-1,d3.max(csvData, d=>d.healthcare)+1])
    .range([height,0]);


  //Create axis functions
  var bottomAxies=d3.axisBottom(xLinearScale);
  var leftAxies=d3.axisLeft(yLinearScale);

  //Append Axes to chart
  chartGroup.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(bottomAxies)

  chartGroup.append("g")
    .call(leftAxies);

    //Create circles
  var circlesGroup=chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".8");

    //Initialize tool tip
    var toolTip=d3.tip()
      .attr("class", "d3-tip")
      .offset([50,-60])
      .html(function(d){
        return (`${d.state}<br>Income: ${d.poverty}<br>${d.healthcare}`);
      });

    //Create tooltip in the chart
    chartGroup.call(toolTip);

    //Create event listeners
    circlesGroup.on("click", function(data){
      toolTip.show(data, this);
    })

      //onmouseout event
      .on("mouseout", function(data){
        toolTip.hide(data);
      })
// Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lack of Healthcare");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (5)");
    }).catch(function(error) {
    console.log(error);

});
