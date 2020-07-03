function test() {
    console.log("Testing");
}

test();


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
    tickers.sort();
    console.log(tickers);
   

    // populate the ticker drop down list
    var dropdownMenu = d3.select("#selTicker");
    dropdownMenu.on("change", updateAll);
    dropdownMenu.selectAll("option").remove();
    tickers.forEach(function(ticker){
        var option = dropdownMenu.append("option").text(ticker);
        option.attr("value", ticker);
    });

    function updateAll(){
        updateSummaryPanel(data);
        updateBarChart(data);
        updateBubbleChart(data);
        updateGauge(data);
    }

    updateAll();
});

function updateSummaryPanel(data) {
    var selectedTicker = d3.select("#selTicker").property("value");
    console.log(`updateSummaryPanel: ${selectedTicker}`);
    
    var summaryPanel = d3.select("#summaryPanel");
    summaryPanel.selectAll("div").remove();
    var company = {}
    for (i = 0; i < data.length; i++) {
        if (data[i].ticker == selectedTicker) {
            company = data[i]
            break;
        }
    }

    Object.entries(company).forEach(([key, value])=>{
        summaryPanel.append("div").text(`${key}: ${value}`);
    });
};

function updateBarChart(data){
    console.log("updateBarChart()");
    
    // sort companies by market cap
    data.sort((a,b) => b.mkt_cap - a.mkt_cap);
    
    

    var top10 = data.slice(0,10);
    top10.reverse();

    var tickers = top10.map(d=>d.ticker);
    var marketCaps = top10.map(d=>d.mkt_cap);
    var labels = top10.map(d=>d.name);

    console.log(tickers);
    console.log(marketCaps);
    console.log(labels);

    var trace = {
        x: marketCaps,
        y: tickers,
        text: labels,
        type: "bar",
        orientation: "h"  
    };

    var data = [trace];

    var layout = {
        margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 25
        }
    };


    Plotly.newPlot("bar", data, layout, {displayModeBar: false});  

};

// show Earnings Per Share (eps)
function updateBubbleChart(data){
    var selectedTicker = d3.select("#selTicker").property("value");
    console.log("updateBubbleChart()");

    var tickers = data.map(d=>d.ticker);
    var values = data.map(d=>d.pe_ratio);
    var labels = data.map(d=>d.name);

    var colors = [];
    var opacities = [];
    for(i=0;i<tickers.length;i++){
        var num1 = Math.floor(Math.random() * 256);
        var num2 = Math.floor(Math.random() * 256);
        var num3 = Math.floor(Math.random() * 256);
        var color = `rgb(${num1}, ${num2}, ${num3})`;
        colors.push(color);

        var opacity = Math.random();
        opacities.push(opacity);
    }

    var trace1 = {
        x: tickers,
        y: values,
        mode: 'markers',
        marker: {
            color: colors,
            opacity: opacities,
            size: values,
            sizemode: 'area',
            sizeref: 0.03,
        },
        text: labels
    }

    var data = [trace1];

    var layout = {
        showlegend: false,
        xaxis: {title:"Companies"},
        yaxis: {title:"Price Earnings Ratio"}
    };

    Plotly.newPlot('bubble', data, layout);

};

// show EPS for single company
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
          value: company.dividend_pct,
          title: { text: `Dividend Percent (${company.ticker})`, font: { size: 24 } },
          subtitle: { text: `${company.ticker}`, font: { size: 18 } },
          gauge: {
            axis: { 
                range: [0, 9], 
                
                tickwidth: 1, 
                tickcolor: "darkblue",
                nticks: 10 
            },
            bar: { color: "purple" },
            bgcolor: "white",
            borderwidth: 4,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: 'rgb(255, 255, 255)'},
              { range: [1, 2], color: "rgb(225, 255, 225)" },
              { range: [2, 3], color: "rgb(195, 255, 195)" },
              { range: [3, 4], color: "rgb(165, 255, 165)" },
              { range: [4, 5], color: "rgb(135, 255, 135)" },
              { range: [5, 6], color: "rgb(105, 255, 105)" },
              { range: [6, 7], color: "rgb(75, 255, 75)" },
              { range: [7, 8], color: "rgb(45, 255, 45)" },
              { range: [8, 9], color: "rgb(0, 255, 0)" },
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 3
            }
          }
        }
      ];
      
    var layout = {
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
     };
      
    Plotly.newPlot('gauge', data, layout);  

};