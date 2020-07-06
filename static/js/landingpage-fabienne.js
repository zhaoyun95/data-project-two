
const url = "/api/v1.0/table";

d3.json(url).then(function(data) {
    console.log(data);

    var tableData = data;

    var tbody = d3.select("tbody");

    data.forEach((stock) => { 
        var row = tbody.append("tr");
        Object.entries(stock).forEach(([key, value]) => {
            row.append("td").text(value);
        });
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

        var filteredData = tableData.filter(stock => stock.ticker === inputValue);
        
        
        filteredData.forEach((selection) => {
            var row = tbody.append("tr");
            Object.entries(selection).forEach(([key, value]) => {
                row.append("td").text(value);   
            });
        });

    };

    function tableReset () {
        d3.event.preventDefault();
        tbody.html("");
        data.forEach((stock) => { 
            var row = tbody.append("tr");
            Object.entries(stock.forEach(([key, value]) => {
                row.append("td").text(value);

            }));
        });
    };
});