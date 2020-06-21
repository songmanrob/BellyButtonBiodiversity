function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    buildMetadata(data.names[0]);
    buildCharts(data.names[0]);
  });
}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) =>
      PANEL.append("h6").text(`${key}: ${value}`)
    );
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArrayM = metadata.filter((sampleObj) => sampleObj.id == sample);
    var resultM = resultArrayM[0];
    var samples = data.samples;
    var resultArray = samples.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    var barValues = result.sample_values.slice(0, 10);
    var barLabels = result.otu_ids.slice(0, 10).map(function (label) {
      return `OTU ${label}`;
    });
    var barHover = result.otu_labels.slice(0, 10);
    console.log(barValues);
    console.log(barLabels);
    console.log(barHover);
    var trace = {
      x: barValues,
      y: barLabels,
      type: "bar",
      orientation: "h",
      text: barHover,
      transforms: [
        {
          type: "sort",
          target: "y",
          order: "descending",
        },
      ],
    };

    var barData = [trace];

    Plotly.newPlot("bar", barData);

    var bubbleValues = result.sample_values.slice(0, 10);
    var bubbleLabels = result.otu_ids.slice(0, 10);
    var bubbleHover = result.otu_labels.slice(0, 10);

    var trace2 = {
      x: bubbleLabels,
      y: bubbleValues,
      text: bubbleHover,
      mode: "markers",
      marker: {
        size: bubbleValues,
        color: bubbleLabels,
      },
    };

    var data = [trace2];

    var layout = {
      xaxis: { title: "OTU ID" },
    };

    Plotly.newPlot("bubble", data, layout);

    var trace3 = {
      domain: {
        x: [0, 10],
        y: [0, 1],
      },
      value: resultM.wfreq,
      title: {
        text:
          "Belly Button Washing Frequency<br><span style='font-size:0.8em;color:gray'>Scrubs per Week</span>",
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 10],
          tickmode: "array",
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        bar: {
          color: "#ffdcb6",
        },
        steps: [
          { range: [0, 2], color: "#f26855" },
          { range: [2, 4], color: "#f6856d" },
          { range: [4, 6], color: "#d94057" },
          { range: [6, 8], color: "#8c223f" },
          { range: [8, 10], color: "#731a3f" },
        ],
      },
    };

    var data3 = [trace3];

    var layout = {
      width: 400,
      height: 300,
      margin: { t: 0, b: 0 },
    };

    Plotly.newPlot("gauge", data3, layout);
  });
}
