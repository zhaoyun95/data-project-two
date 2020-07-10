const url = "/api/v1.0/table";

d3.json(url).then(function(tableData) {
    var tableValues = tableData.map(function(value){
        return Object.values(value)
    });

    var tbody = d3.select("tbody");

    console.log(tableValues);
    
        $('#stock-table').DataTable( {
            data: tableValues,
            columns: [
                { title: "Company Came" },
                { title: "Ticker" },
                { title: "Market Cap" },
                { title: "Exchange" },
                { title: "Sector" },
                { title: "Country" },
                { title: "City" }
            ]
        });
    
    
    runEnter()
    tableReset()

    function runEnter() {

        d3.event.preventDefault();
        
        tbody.html("");

        var inputElement = d3.select("#ticker");
        var inputValue = inputElement.property("value");


        var filteredData = tableData.filter(stock => stock.ticker == inputValue.toUpperCase());
        
        
        filteredData.forEach((stock) => { 
            var row = tbody.append("tr");
            row.append("td").text(stock.name);
            row.append("td").text(stock.ticker);
            row.append("td").text(stock.mkt_cap);
            row.append("td").text(stock.exchange);
            row.append("td").text(stock.sector);
            row.append("td").text(stock.country);
            row.append("td").text(stock.city);
        });

    };

    function tableReset () {
        d3.event.preventDefault();
        tbody.html("");
        tableData.forEach((stock) => { 
            var row = tbody.append("tr");
            row.append("td").text(stock.name);
            row.append("td").text(stock.ticker);
            row.append("td").text(stock.mkt_cap);
            row.append("td").text(stock.exchange);
            row.append("td").text(stock.sector);
            row.append("td").text(stock.country);
            row.append("td").text(stock.city);
        });
    };
});

const url2 = "/api/v1.0/company";
d3.json(url).then(function(data) {
    // sort data by company name
    data.sort(function(a,b){
        if (a.name < b.name) {
            return -1;
        } else {
            return 1;
        }
    });

    console.log(data);

    createPieChart(data);
});


// create a pie chart of sectors
function createPieChart(data){
    console.log(data);

    sectors = data.map(d=>d.sector);

    sectorCounts = {};

    sectors.forEach(function(d){
        if (sectorCounts[d]) {
            sectorCounts[d] += 1;
        } else {
            sectorCounts[d] = 1;
        }
    })

    console.log(sectorCounts);
    
    var labels = [];
    var values = [];

    Object.entries(sectorCounts).forEach(([key, value]) => {
        labels.push(key);
        values.push(value);
    });

    console.log(labels);
    console.log(values);

    var trace1 = {
        labels: labels,
        values: values,
        type: 'pie'
        };
    
        var data = [trace1];
    
        var layout = {

            title: "Sector Chart"
        };
    
        Plotly.newPlot("pieChart", data, layout);
};
