// Reference 14-03-02
// Reference 14-08
// Reference 14-09
// Reference 14-10
// Tutor Session
// ChatGPT


// Read from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON samples data
d3.json(url).then(function(data) {
    console.log(data);
    init(data); 
});

// Initialise
function init(data) {
    Metadata(data, data.names[0]);
    Charts(data, data.names[0]);
    
    // Add event listener to dropdown menu
    d3.select("#selDataset").on("change", function() {
        var selectedSample = d3.select(this).property("value");
        Metadata(data, selectedSample);
        Charts(data, selectedSample);
    });
}

// Create metadata
function Metadata(data, sample){
    var metadata = data.metadata;
    var results_array = metadata.filter(sampleObj => sampleObj.id == sample);
    var results = results_array[0];
    var dropdownMenu = d3.select("#selDataset");
    dropdownMenu.html(""); 
    metadata.map(obj => obj.id).forEach(id => {
        dropdownMenu.append("option").text(id).property("value", id);
    });

    // Info panel
    var demographicInfoPanel = d3.select("#sample-metadata");
    demographicInfoPanel.html(""); 
    Object.entries(results).forEach(([key, value]) => {
        demographicInfoPanel.append("p").text(`${key}: ${value}`);
    });
}

// Creation of bar graph
function Charts(data, sample){
    var samples = data.samples;
    var results_array = samples.filter(sampleObj => sampleObj.id == sample);
    var results = results_array[0]; 

    var otu_ids = results.otu_ids;
    var otu_labels = results.otu_labels;
    var sample_values = results.sample_values;

    var ydata = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse()

    var initialData = {
        x: sample_values.slice(0, 10).reverse(),
        y: ydata,
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
    };
    
    var layout = {
        title: 'Top 10 Bacteria Cultures Found',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' },
        margin: {t: 30, l: 150}
    };

    Plotly.newPlot('bar', [initialData], layout);

    // Creation of bubble graph
    var bubbleData = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Rainbow'
        }
    };

    var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
        showlegend: false,
        height: 600,
        width: 1200
    };

    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
}