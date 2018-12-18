function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });
  
  });


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartUrl = `/samples/${sample}`;

  // @TODO: Build a Bubble Chart using the sample data
  d3.json(chartUrl).then((sData) => {

    console.log(sData);

    var trace1 = {
      x: sData.otu_ids,
      y: sData.sample_values,
      mode: 'markers',
      type: 'scatter',
      hovertext: sData.otu_labels,
      marker: {
        color: 'red',
        size: sData.sample_values
      }
    };

    var bubbleData = [trace1];

    var bubbleLayout = {
      title: 'Bubble Chart',
      showlegend: false,
      xaxis: {title: 'OTU IDs'},
      yaxis: {title: 'Sample Values'},
      height: 600
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).

  //sort descending
  // var sortD = sData.sortBy((first, second) => second.sample_values - first.sample_values).slice(0, 10);
  // console.log(sortD)

  var descSortVal = sData.sample_values.sort((first, second) => second - first).slice(0, 10);
  console.log(descSortVal);

  var descSortLab = sData.otu_ids.slice(0, 10);
  console.log(descSortLab);

  var descSortHov = sData.otu_labels.slice(0, 10);
  console.log(descSortHov);

  var trace2 = {
    values: descSortVal,
    labels: descSortLab,
    hovertext: descSortHov,
    type: 'pie'
  };

  var pieData = [trace2];

  var pieLayout = {
    title: 'Pie Chart'
  }

  Plotly.newPlot('pie', pieData, pieLayout)

  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
