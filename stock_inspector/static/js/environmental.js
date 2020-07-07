
const url = "/api/v1.0/company";

d3.json(url).then(function(data){
    // remove companies with no esg score
    data = data.filter(d=>d.esg_score>0);

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

    updateGauge(data);
    createESGBarChart(data);
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
              { range: [ 0, 10], color: 'rgb()'},
              { range: [10, 20], color: "rgb(204, 255, 229)" },
              { range: [20, 30], color: "rgb(153, 255, 204)" },
              { range: [30, 40], color: "rgb(102, 255, 178)" },
              { range: [40, 50], color: "rgb(51, 255, 153)" },
              { range: [50, 60], color: "rgb(0, 255, 128)" },
              { range: [60, 70], color: "rgb(0, 204, 102)" },
              { range: [70, 80], color: "rgb(0, 153, 76)" },
              { range: [80, 100], color: "rgb(0, 102, 51)" },
            ],
            threshold: {
              line: { color: "purple", width: 4 },
              thickness: 0.75,
              value: 20
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


function createESGBarChart(data){
  console.log("createESGBarChart()");

  // sort companies by esg score
  data.sort((a,b) => a.esg_score - b.esg_score);

  var esgValues = data.map(d=>d.esg_score);
  var tickers = data.map(d=>d.ticker);
  var labels = data.map(d=>d.name);

  var colors = [];
  for(i=0;i<tickers.length;i++){
      var num1 = Math.floor(Math.random() * 256);
      var num2 = Math.floor(Math.random() * 256);
      var num3 = Math.floor(Math.random() * 256);
      var color = `rgb(${num1}, ${num2}, ${num3})`;
      colors.push(color);
  }

  var trace = {
      x: tickers,
      y: esgValues,
      text: labels,
      type: "bar",
      marker: {
        color: colors,
      }
  };

  var chartData = [trace];

  var layout = {
      margin: {
          l: 50,
          r: 50,
          t: 40,
          b: 100
      },
      xaxis: {title: "Tickers"},
      yaxis: {title: "ESG Score"},
      title: {text: "Environmental, Social, Goverance Risk Score" }
  };


  Plotly.newPlot("esgBar", chartData, layout, {displayModeBar: false});  

};