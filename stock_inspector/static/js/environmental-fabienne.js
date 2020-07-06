
const url = "/api/v1.0/company";

d3.json(url).then(function(data){

    // sort companies by ticker symbol
    data.sort(function(a,b){
        if (a.ticker < b.ticker) {
            return -1;
        } else {
            return 1;
        }
    });
    // display all data
    console.log(data);


    // get all tickers
    var tickers = data.map(d=>d.ticker);
    var names = data.map(d=>d.name);
    tickers.sort();
    console.log(tickers);
   

    // populate the ticker drop down list
    var dropdownMenu = d3.select("#selTicker");
    dropdownMenu.on("change", updatePage);
    dropdownMenu.selectAll("option").remove();
    tickers.forEach(function(ticker, i){
        var option = dropdownMenu.append("option").text(`${ticker} ${names[i].substring(0,12)}`);
        option.attr("value", ticker);
    });

    function updatePage(){;
        updateGauge(data);
    }

});


function updateGauge(data){
    var selectedTicker = d3.select("#selTicker").property("value");
    console.log(`updateGauge: ${selectedTicker}`);

    var company = {}
    for (i = 0; i < data.length; i++) {
        if (data[i].ticker == selectedTicker) {
            company = data[i];
            break;
        }
    }

    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: company.esg_score,
          title: { text: 'ESG Score', font: { size: 24 } },
        //   subtitle: { text: `${company.ticker}`, font: { size: 18 } },
          gauge: {
            axis: { 
                range: [0, 99], 
                
                tickwidth: 1, 
                tickcolor: "darkblue",
                nticks: 10 
            },
            bar: { color: "green" },
            bgcolor: "white",
            borderwidth: 4,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: 'rgb()'},
              { range: [1, 2], color: "rgb(204, 255, 229)" },
              { range: [2, 3], color: "rgb(153, 255, 204)" },
              { range: [3, 4], color: "rgb(102, 255, 178)" },
              { range: [4, 5], color: "rgb(51, 255, 153)" },
              { range: [5, 6], color: "rgb(0, 255, 128)" },
              { range: [6, 7], color: "rgb(0, 204, 102)" },
              { range: [7, 8], color: "rgb(0, 153, 76)" },
              { range: [8, 9], color: "rgb(0, 102, 51)" },
            ],
            threshold: {
              line: { color: "black", width: 4 },
              thickness: 0.75,
              value: 3
            }
          }
        }
      ];
      
    var layout = {
        margin: { t: 60, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lightgrey",
        font: { color: "black", family: "Arial" },
        // title: {text: `${company.ticker}`, font: { size: 30 }}
     };
      
    Plotly.newPlot('gauge', data, layout);  

};