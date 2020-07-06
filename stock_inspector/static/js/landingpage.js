
const url = "/api/v1.0/table";

d3.json(url).then(function(tableData) {
    // sort data by company name
    tableData.sort(function(a,b){
        if (a.name < b.name) {
            return -1;
        } else {
            return 1;
        }
    });
    // display all data
    console.log(tableData);

    var tbody = d3.select("tbody");

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

    var button = d3.select("#filter-btn");
    var form = d3.select("#filter");
    var reset = d3.select("#reset-btn");

    button.on("click", runEnter);
    form.on("submit", runEnter);
    reset.on("click", tableReset);


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