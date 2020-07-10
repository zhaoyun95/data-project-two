const url = "/api/v1.0/table";
d3.json(url).then(function(tableData) {
    createPieChart(tableData);
    
    var tableValues = tableData.map(function(value){
        return Object.values(value)
    });

    // console.log(tableValues);
    
    // create the companies table with DataTable javascript
    $('#stock-table').DataTable( {
        data: tableValues,
        columns: [
            { title: "Company Name" },
            { title: "Ticker" },
            { title: "Market Cap" },
            { title: "Exchange" },
            { title: "Sector" },
            { title: "Country" },
            { title: "City" }
        ]
    });
});

// create a pie chart of sectors
function createPieChart(data){
    sectors = data.map(d=>d.sector);
    sectorCounts = {};

    //get count of each sector
    sectors.forEach(function(d){
        if (sectorCounts[d]) {
            sectorCounts[d] += 1;
        } else {
            sectorCounts[d] = 1;
        }
    })
    
    var labels = [];
    var values = [];

    Object.entries(sectorCounts).forEach(([key, value]) => {
        labels.push(key);
        values.push(value);
    });

    var trace1 = {
        labels: labels,
        values: values,
        type: 'pie'
        };
    
    var data = [trace1];

    var layout = {

        data: "Sector Chart"
    };

    Plotly.newPlot("pieChart", data, layout);
};
