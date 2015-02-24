var premium_input = 0.85

d3.select("#button_85").attr("class","selected")
d3.select("#button_135").attr("class","disabled")

var $graphic = $('#chart_container');
var $labels = $('#right_labels');
var graphic_aspect_width = 43;
var graphic_aspect_height = 55;
var mobile_threshold = 300;

function drawGraphic(){
  $graphic.empty();
  var margin = {top: 20, right: 0, bottom: 90, left: 0},
        width = $graphic.width() - margin.left - margin.right,
        height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;

    var bar_label;
    if (width < mobile_threshold) {
      bar_label = " M";
      d3.select("#right_labels").attr("style","display:none")
      width = width*1.5
    }
    else{
      bar_label = " million"
      d3.select("#right_labels").attr("style","display:block")
    }



    d3.select("#right_labels").attr("height",height)
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "");

    x.domain(["0.50%","0.75%","1.0%"]);
    y.domain([0, 7000000]);

    var sampleSize = 6618779
    var excluded =   2200000

    var svg = d3.select("#chart_container").append("svg")
        .attr("class","graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  d3.tsv("data/data.tsv", function(d) {
    return {
      rate: +d.Refinance_Note_Rate,
      premium: +d.Annual_Premium,
      spread: +d.Spread,
      estimate: +(d.Refi_Volume_Estimate.replace(/,/g,''))
      };
    }, function(error, data) {




  function bindButtons(){
    $("#embed_button").click(function(e){
      d3.select("#url_input").attr("value",
        "<iframe src = \"http://datatools.urban.org/features/fha-refinance/index.html/?rate=" + $("#rate-value").text() + "&premium=" + premium_input + "\">"
      )
    })

    $('#buttons button').click(function(e){ 
      var thisObj = $(this);
      $('#buttons').removeClass('selected');
      thisObj.removeClass('disabled').addClass('selected').siblings().addClass('disabled');
      var val = thisObj.attr('id')=='button_85' ? .85 : 1.35;    
        premium_input = val;
        drawBars(d3.select('#rate')[0][0].value,+val);
    })
  }
  bindButtons();

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      var ytest = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    	function drawBars(rate,premium){

    	  var rate = parseFloat(rate);
    	  var premium = parseFloat(premium);

    	  rate = roundRate(rate);

        var s50 = estimate(rate,premium,.5)
        var s75 = estimate(rate,premium,.75)
        var s100 = estimate(rate,premium,1)
        var formatter = d3.format(".1f")
        var summary = [{s50:s50,s75:s75,s100:s100}]


    	  d3.select("#rate").value = rate


        // var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    
        // $(tmp).css('background-image',
        //         '-webkit-gradient(linear, left top, right top, '
        //         + 'color-stop(' + val + ', #ec008c), '
        //         + 'color-stop(' + val + ', #888888)'
        //         + ')'
        //         );

    	  d3.select("#rate-value").text(rate);
    	  d3.select("#premium-value").text(premium);
        

        var s50_text = formatter(s50/1000000) + bar_label;
        var s75_text = formatter(s75/1000000) + bar_label;
        var s100_text = formatter(s100/1000000) + bar_label;

        var s50_text_other = formatter((sampleSize - s50)/1000000) + bar_label;
        var s75_text_other = formatter((sampleSize - s75)/1000000) + bar_label;
        var s100_text_other = formatter((sampleSize - s100)/1000000) + bar_label;

        var text_excluded = "2.2" + bar_label;



    	  d3.selectAll('.bar').remove();
        d3.selectAll('.label').remove();



    	    var bars = svg.selectAll(".bar")
    	      .data(summary);

    	    bars.enter().append("rect")
    	        .attr("class", "bar benefit")
    	        .attr("x", x("0.50%"))
    	        .attr("height",   function(d){return height - y(d.s50);})
    	        .attr("width", x.rangeBand())
    	        .attr("y",  function(d){return y(d.s50);})
          

          bars.enter().append("rect")
              .attr("class", "bar benefit")
              .attr("x", x("0.75%"))
              .attr("height",   function(d){return height - y(d.s75);})
              .attr("width", x.rangeBand())
              .attr("y",  function(d){return y(d.s75);})

          bars.enter().append("rect")
              .attr("class", "bar benefit")
              .attr("x", x("1.0%"))
              .attr("height",   function(d){return height - y(d.s100);})
              .attr("width", x.rangeBand())
              .attr("y",  function(d){return y(d.s100);})

          bars.enter().append("rect")
              .attr("class", "bar other")
              .attr("x", x("0.50%"))
              .attr("height", function(d){return height -y(sampleSize - d.s50);})
              .attr("width", x.rangeBand())
              .attr("y", y(sampleSize) )

          bars.enter().append("rect")
              .attr("class", "bar other")
              .attr("x", x("0.75%"))
              .attr("height", function(d){return height -y(sampleSize - d.s75);})
              .attr("width", x.rangeBand())
              .attr("y", y(sampleSize) )

          bars.enter().append("rect")
              .attr("class", "bar other")
              .attr("x", x("1.0%"))
              .attr("height", function(d){return height -y(sampleSize - d.s100);})
              .attr("width", x.rangeBand())
              .attr("y", y(sampleSize) )


          bars.enter()
              .append("rect")
              .attr("class", "bar excluded")
              .attr("x", x("0.75%"))
              .attr("height", height - y(excluded))
              .attr("width", x.rangeBand())
              .attr("y", y(sampleSize))

          bars.enter()
              .append("rect")
              .attr("class", "bar excluded")
              .attr("x", x("0.50%"))
              .attr("height", height - y(excluded))
              .attr("width", x.rangeBand())
              .attr("y", y(sampleSize))

          bars.enter()
              .append("rect")
              .attr("class", "bar excluded")
              .attr("x", x("1.0%"))
              .attr("height", height - y(excluded))
              .attr("width", x.rangeBand())
              .attr("y", y(sampleSize))
    	    // var barUpdate = d3.transition(bars)
    	    //   .transition().duration(500)
    	    //   .attr("height", function(d) { return height - y(s50); })
    	    //   .attr("y", function(d) { return y(s50); });

          bars.enter().append("rect")
              .attr("x", x("0.50%")-8)
              .attr("height", 1)
              .attr("width", width-1)
              .attr("y",  height)


          bars.enter().append("text")
              .attr("class","bar_label benefit")
              .attr("x", x("0.50%")+x.rangeBand()/7)
              .attr("y",  function(d){
                if(d.s100 <= 1400000){
                  return y(d.s50)*.97;
                }
                else{
                  return y(d.s50/2)
                }
              })
              .attr("dy", ".35em")
              .attr("fill","white")
              .text(s50_text)

          bars.enter().append("text")
              .attr("class","bar_label benefit")
              .attr("x", x("0.75%")+x.rangeBand()/7)
              .attr("y",  function(d){
                if(d.s100 <= 1400000){
                  return y(d.s75)*.97;
                }
                else{
                  return y(d.s75/2)
                }
              })              
              .attr("dy", ".35em")
              .attr("fill","white")
              .text(s75_text)


          bars.enter().append("text")
              .attr("class","bar_label benefit")
              .attr("x", x("1.0%")+x.rangeBand()/7)
              .attr("y",  function(d){
                if(d.s100 <= 1400000){
                  return y(d.s100)*.97;
                }
                else{
                  return y(d.s100/2)
                }
              })              
              .attr("dy", ".35em")
              .attr("fill","white")
              .text(s100_text)



          bars.enter().append("text")
              .attr("class","bar_label other")
              .attr("x", x("0.50%")+x.rangeBand()/5)
              .attr("y",  height - y(excluded*1.3))
              .attr("dy", ".35em")
              .attr("fill","#71797a")
              .text(s50_text_other)

          bars.enter().append("text")
              .attr("class","bar_label other")
              .attr("x", x("0.75%")+x.rangeBand()/5)
              .attr("y", height - y(excluded*1.3) )
              .attr("dy", ".35em")
              .attr("fill","#71797a")
              .text(s75_text_other)


          bars.enter().append("text")
              .attr("class","bar_label other")
              .attr("x", x("1.0%")+x.rangeBand()/5)
              .attr("y",  height - y(excluded*1.3))
              .attr("dy", ".35em")
              .attr("fill","#71797a")
              .text(s100_text_other)



          bars.enter().append("text")
              .attr("class","bar_label excluded")
              .attr("x", x("0.50%")+x.rangeBand()/5)
              .attr("y",  height - y(excluded*0.3))
              .attr("dy", ".35em")
              .attr("fill","#a4a8ab")
              .text(text_excluded)

          bars.enter().append("text")
              .attr("class","bar_label excluded")
              .attr("x", x("0.75%")+x.rangeBand()/5)
              .attr("y",  height - y(excluded*0.3))
              .attr("dy", ".35em")
              .attr("fill","#a4a8ab")
              .text(text_excluded)


          bars.enter().append("text")
              .attr("class","bar_label excluded")
              .attr("x", x("1.0%")+x.rangeBand()/5)
              .attr("y",  height - y(excluded*0.3))
              .attr("dy", ".35em")
              .attr("fill","#a4a8ab")
              .text(text_excluded)



// X axis labels
          bars.enter().append("text")
              .attr("class","label s50_x_label")
              .attr("x", x("0.50%")+x.rangeBand()/4.7)
              .attr("y",  height+50)
              .attr("dy", ".35em")
              .attr("fill","#a4a8ab")
              .text("AGGRESIVE")
          bars.enter().append("text")
              .attr("class","label s50_x_label")
              .attr("x", x("0.50%")+x.rangeBand()/5.9)
              .attr("y",  height+62)
              .attr("dy", ".35em")
              .attr("fill","#a4a8ab")
              .text("BORROWERS")

          bars.enter().append("text")
              .attr("class","label s100_x_label")
              .attr("x", x("1.0%")+x.rangeBand()/7.3)
              .attr("y",  height+50)
              .attr("dy", ".35em")
              .attr("fill","#a4a8ab")
              .text("CONSERVATIVE")
          bars.enter().append("text")
              .attr("class","label s100_x_label")
              .attr("x", x("1.0%")+x.rangeBand()/5.9)
              .attr("y",  height+62)
              .attr("dy", ".35em")
              .attr("fill","#a4a8ab")
              .text("BORROWERS")

          bars.enter().append("text")
              .attr("class","label s75_x_label")
              .attr("x", x("0.75%")-x.rangeBand()/8)
              .attr("y",  height+50)
              .attr("dy", ".35em")
              .attr("fill","#000")
              .text("MOST BORROWERS")
      $('.x.axis text:contains("0.75%")').css("fill","#000").css("font-weight",700)
  	}

  d3.select("#rate").on("input", function() {
    var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    
    $(this).css('background-image',
                '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', #ec008c), '
                + 'color-stop(' + val + ', #888888)'
                + ')'
                );
    drawBars(+this.value, premium_input);
  });

  var init_rate,init_premium;
  var urlVars = getUrlVars();
  if (urlVars.hasOwnProperty("rate")){
    init_rate = urlVars["rate"]
     // = init_rated3.select("#rate").value
  }
  else{
    init_rate = 3.75
  }

  if (urlVars.hasOwnProperty["premium"]){
    init_premium = urlVars["premium"]
  }
  else{
    init_premium = .85
  }
  drawBars(init_rate,init_premium);


  function estimate(rate,premium,spread){
  	var value = $.grep(data, function(obj){
  		return obj.rate == rate && obj.premium == premium && obj.spread == spread
  	});
    return value[0].estimate
  }
  function roundRate(rate){
  	 if(rate > 3.58 && rate < 3.705){
  	 	return 3.66
  	 }
  	 else{
  		return (Math.round(rate * 4) / 4).toFixed(2);
  	 }
  }

  function type(d) {
    d.value = +d.value;
    return d;
  }

  function getUrlVars()
  {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  }



  });

}

drawGraphic()
window.onresize = drawGraphic




