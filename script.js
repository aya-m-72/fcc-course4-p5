const DATASETS = {
  videogames: {
    TITLE: "Video Game Sales",
    DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform",
    FILE_PATH:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  },
  movies: {
    TITLE: "Movie Sales",
    DESCRIPTION: "Top 100 Highest Grossing Movies Grouped By Genre",
    FILE_PATH:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  },
  kickstarter: {
    TITLE: "Kickstarter Pledges",
    DESCRIPTION:
      "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    FILE_PATH:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
  },
}

const urlParams = new URLSearchParams(window.location.search)
const DEFAULT_DATASET = "videogames"
const DATASET = DATASETS[urlParams.get("data") || DEFAULT_DATASET]

document.getElementById("title").textContent = DATASET.TITLE
document.getElementById("description").textContent = DATASET.DESCRIPTION

const colors = d3
  .scaleOrdinal()
  .range([
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#ffbb78",
    "#2ca02c",
    "#98df8a",
    "#d62728",
    "#ff9896",
    "#9467bd",
    "#c5b0d5",
    "#8c564b",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
    "#9edae5",
  ])
const canvas = d3.select("#canvas")
const legend = d3.select("#legend")
const tooltip = d3.select("#tooltip")

const drawMap = (dataset) => {
  const hierarchy = d3
    .hierarchy(dataset, (node) => node.children)
    .sum((node) => node.value)
    .sort((node1, node2) => node2.value - node1.value)
  const createTreeMap = d3.treemap().size([1000, 700])
  createTreeMap(hierarchy)

  const TILES = hierarchy.leaves()
  console.log(TILES)

  const block = canvas
    .selectAll("g")
    .data(TILES)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)

  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => colors(d.data.category))
    .attr("data-name", (d) => d.data.name)
    .attr("data-value", (d) => d.data.value)
    .attr("data-category", (d) => d.data.category)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .on("mousemove", (e, d) => {
      const x = $(e.target).offset()
      tooltip
        .attr("data-value", d.data.value)
        .style("opacity", "1")
        .style("left", x.left + "px")
        .style("top", x.top-80 + "px")
        .html(`Name: ${d.data.name}<br/>Category: ${d.data.category}<br/>Value: ${d.data.value}`)
    })
    .on("mouseout",d=>{
        tooltip.style("opacity","0").style("left",0).style("right",0)
    })

  block
    .append("text")
    .text((d) => d.data.name)
    .attr("x", 5)
    .attr("y", 20)

  const categories = new Set(TILES.map((tile) => tile.data.category))
  legend
    .selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", (d, i) => i * 30)
    .attr("fill", (d) => colors(d))
  legend
    .selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("x", 30)
    .attr("y", (d, i) => i * 30 + 15)
}

d3.json(DATASET.FILE_PATH)
  .then((data) => {
    drawMap(data)
  })
  .catch((err) => console.log(err))
