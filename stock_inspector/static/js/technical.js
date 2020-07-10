/* global d3, _ */
// Date Parser Link: https://github.com/d3/d3-time-format
// d3.time.format() https://d3-wiki.readthedocs.io/zh_CN/master/Time-Formatting/

function makePriceChart(){
  // which stock are we dealing with?
    var selectedTicker = d3.select("#selTicker").property("value");
  
    var margin = {top: 30, right: 20, bottom: 100, left: 50},
      margin2  = {top: 210, right: 20, bottom: 20, left: 50},
      width    = 1000 - margin.left - margin.right,
      height   = 283 - margin.top - margin.bottom,
      height2  = 283 - margin2.top - margin2.bottom;
   
    var bisectDate = d3.bisector(function(d) { return d.date; }).left,
      legendFormat = d3.time.format('%b %d, %Y');
  
      // Created a time scale & linear scale and specified our domain and range using the data.
    var x = d3.time.scale().range([0, width]),
      x2  = d3.time.scale().range([0, width]),
      y   = d3.scale.linear().range([height, 0]),
      y1  = d3.scale.linear().range([height, 0]),
      y2  = d3.scale.linear().range([height2, 0]),
      y3  = d3.scale.linear().range([60, 0]);
  
      // The d3.axisBottom() and d3.axisLeft() functions have been introduced in the 
      // latest version of D3 i.e. version 4. 
      // Earlier versions used d3.svg.axis() with orient("left") and orient("bottom") 
      // for y-axis and x-axis respectively.
    var xAxis = d3.svg.axis().scale(x).orient('bottom'),
      xAxis2  = d3.svg.axis().scale(x2).orient('bottom'),
      yAxis   = d3.svg.axis().scale(y).orient('left');
  
    var priceLine = d3.svg.line()
      .interpolate('monotone')
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });
  
    var avgLine = d3.svg.line()
      .interpolate('monotone')
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y((d.open + d.close)/2); });
  
    var area2 = d3.svg.area()
      .interpolate('monotone')
      .x(function(d) { return x2(d.date); })
      .y0(height2)
      .y1(function(d) { return y2(d.close); });
  
    // clear price chart
    if (document.getElementById("appendCheck").checked == false) {
      var priceChart = d3.select('#priceChart');
      priceChart.html("");
    }
  
    var svg = d3.select('#priceChart').append('svg')
      .attr('class', 'chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 60);
  
    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);
  
    var make_y_axis = function () {
      return d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(3);
    };
  
    var focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    var barsGroup = svg.append('g')
      .attr('class', 'volume')
      .attr('clip-path', 'url(#clip)')
      .attr('transform', 'translate(' + margin.left + ',' + (margin.top + 60 + 20) + ')');
  
    var context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin2.left + ',' + (margin2.top + 60) + ')');
  
    var legend = svg.append('g')
      .attr('class', 'chart__legend')
      .attr('width', width)
      .attr('height', 30)
      .attr('transform', 'translate(' + margin2.left + ', 10)');
  
    legend.append('text')
      .attr('class', 'chart__symbol')
      .text(selectedTicker)
      .style("font-size", "10px")
      .style("font-weight", "bold") // Need exchange, company name, ticker drop
  
    var rangeSelection =  legend
      .append('g')
      .attr('class', 'chart__range-selection')
      .attr('transform', 'translate(110, 0)');
  
    var tempURL = `/api/v1.0/price/${selectedTicker}`;
    var url = selectedTicker == "" ? '/api/v1.0/price/AAPL' : tempURL;
    d3.json(url, function(data) {
  
      // convert json elements to Date and numbers
      data.forEach(function(d){
        d.date = new Date(d.date);
        d.close = +d.close;
        d.price = +d.close;
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.avg = (d.high + d.low)/2;
        d.adj_close = +d.adj_close;
        d.volume = +d.volume;
      });
  
  
      var brush = d3.svg.brush()
        .x(x2)
        .on('brush', brushed);
  
      var xRange = d3.extent(data.map(function(d) { return d.date; }));
  
      x.domain(xRange);
      y.domain(d3.extent(data.map(function(d) { return d.price; })));
      y3.domain(d3.extent(data.map(function(d) { return d.price; })));
      x2.domain(x.domain());
      y2.domain(y.domain());
  
      //used d3.min and d3.max functions to get the minimum and maximum values from the dataset.
      var min = d3.min(data.map(function(d) { return d.price; }));
      var max = d3.max(data.map(function(d) { return d.price; }));
  
      var range = legend.append('text')
        .text(legendFormat(new Date(xRange[0])) + ' - ' + legendFormat(new Date(xRange[1])))
        .style('text-anchor', 'end')
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr('transform', 'translate(' + width + ', 0)');
  
      // appending group elemet and inserting y-axis
      focus.append('g')
          .attr('class', 'y chart__grid')
          .call(make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat(''));
  
          // appending avg price adat point overtime as trend line (adj_closing)
      var avgChart = focus.append('path')
          .datum(data)
          .attr('class', 'chart__line chart__avg--focus line')
          .attr('d', avgLine);
  
          // appending price Line (closing values)
      var priceChart = focus.append('path')
          .datum(data)
          .attr('class', 'chart__line chart__price--focus line')
          .attr('d', priceLine);
  
          //Draws x-axis
      focus.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0 ,' + height + ')')
          .call(xAxis);
  
          //Draws y-axis
      focus.append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(12, 0)')
          .call(yAxis);
          
       // y-axis label
      focus.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .text("Price ($M)");  
  
  
  
  // Bar graph for Volume
      var focusGraph = barsGroup.selectAll('rect')
          .data(data)
        .enter().append('rect')
          .attr('class', 'chart__bars')
          .attr('x', function(d, i) { return x(d.date); })
          .attr('y', function(d) { return 150 - y3(d.price); })
          .attr('width', 0.5)
          .attr('height', function(d) { return y3(d.price); });
  
      var helper = focus.append('g')
        .attr('class', 'chart__helper')
        .style('text-anchor', 'end')
        .attr('transform', 'translate(' + width + ', 0)');
  
      var helperText = helper.append('text')
  
      var priceTooltip = focus.append('g')
        .attr('class', 'chart__tooltip--price')
        .append('circle')
        .style('display', 'none')
        .attr('r', 3.0);
  
      var avgTooltip = focus.append('g')
        .attr('class', 'chart__tooltip--close')
        .append('circle')
        .style('display', 'none')
        .attr('r', 3.0);
  
      var mouseArea = svg.append('g')
        .attr('class', 'chart__mouse')
        .append('rect')
        .attr('class', 'chart__overlay')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .on('mouseover', function() {
          helper.style('display', null);
          priceTooltip.style('display', null);
          avgTooltip.style('display', null);
        })
        .on('mouseout', function() {
          helper.style('display', 'none');
          priceTooltip.style('display', 'none');
          avgTooltip.style('display', 'none');
        })
        .on('mousemove', mousemove);
  
      context.append('path')
          .datum(data)
          .attr('class', 'chart__area area')
          .attr('d', area2);
  
      context.append('g')
          .attr('class', 'x axis chart__axis--context')
          .attr('y', 0)
          .attr('transform', 'translate(0,' + (height2 - 22) + ')')
          .call(xAxis2);
  
      context.append('g')
          .attr('class', 'x brush')
          .call(brush)
          .selectAll('rect')
          .attr('y', -6)
          .attr('height', height2 + 7);
  
      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectDate(data, x0, 1);
        var d0 = data[i - 1];
        var d1 = data[i];
        var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        var average = ((d.high + d.low)/2).toFixed(2);
        helperText.text(legendFormat(new Date(d.date)) + ' - Price: ' + (d.price).toFixed(2) + ' Avg: ' +average + 'Volume: ' +d.volume);
        priceTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.price) + ')');
        avgTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.avg) + ')');
      }
  
      // Date Slider
      function brushed() {
        var ext = brush.extent();
        if (!brush.empty()) {
          x.domain(brush.empty() ? x2.domain() : brush.extent());
          y.domain([
            d3.min(data.map(function(d) { return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : max; })),
            d3.max(data.map(function(d) { return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : min; }))
          ]);
          range.text(legendFormat(new Date(ext[0])) + ' - ' + legendFormat(new Date(ext[1])))
          focusGraph.attr('x', function(d, i) { return x(d.date); });
  
          var days = Math.ceil((ext[1] - ext[0]) / (24 * 3600 * 1000))
          focusGraph.attr('width', (40 > days) ? (40 - days) * 5 / 6 : 5)
        }
  
        priceChart.attr('d', priceLine);
        avgChart.attr('d', avgLine);
        focus.select('.x.axis').call(xAxis);
        focus.select('.y.axis').call(yAxis);
      }
  
      var dateRange = ['1w', '1m', '3m', '6m', '1y', '5y']
      for (var i = 0, l = dateRange.length; i < l; i ++) {
        var v = dateRange[i];
        rangeSelection
          .append('text')
          .attr('class', 'chart__range-selection')
          .text(v)
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .attr('transform', 'translate(' + (18 * i) + ', 0)')
          .on('click', function(d) { focusOnRange(this.textContent); });
      }
  
      function focusOnRange(range) {
        var today = new Date(data[data.length - 1].date)
        console.log(today)
        var ext = new Date(data[data.length - 1].date)
  
        if (range === '1m')
          ext.setMonth(ext.getMonth() - 1)
  
        if (range === '1w')
          ext.setDate(ext.getDate() - 7)
  
        if (range === '3m')
          ext.setMonth(ext.getMonth() - 3)
  
        if (range === '6m')
          ext.setMonth(ext.getMonth() - 6)
  
        if (range === '1y')
          ext.setFullYear(ext.getFullYear() - 1)
  
        if (range === '5y')
          ext.setFullYear(ext.getFullYear() - 5)
  
        brush.extent([ext, today])
        brushed()
        context.select('g.x.brush').call(brush.extent([ext, today]))
      }
  
    });// end Data
  };
  
  
  makePriceChart();
  
  
  const url2 = "/api/v1.0/company";
  d3.json(url2, function(data){
  
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
  
      function updatePage(){
          makePriceChart();
      }
  
      // create initial charts
      updatePage();
  });
  