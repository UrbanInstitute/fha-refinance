$('input[type="range"]').change(function () {
    var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    
    $(this).css('background-image',
                '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', #ec008c), '
                + 'color-stop(' + val + ', #888888)'
                + ')'
                );
});


var margin = {top: 20, right: 50, bottom: 30, left: 100},
      width = 560 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

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

  var sampleSize = 6600000
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

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var ytest = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  	function drawBars(rate,premium){
  	  // var s75
  	  // var s1
  	  var rate = parseFloat(rate);
  	  var premium = parseFloat(premium);

  	  rate = roundRate(rate);

      var s50 = estimate(rate,premium,.5)
      var s75 = estimate(rate,premium,.75)
      var s100 = estimate(rate,premium,1)
      var formatter = d3.format(".1f")
      var summary = [{s50:s50,s75:s75,s100:s100}]


  	  d3.select("#rate").value = rate

  	  d3.select("#rate-value").text(rate);
  	  d3.select("#premium-value").text(premium);
      var s50_text = formatter(s50/1000000) + " million";
      var s75_text = formatter(s75/1000000) + " million";
      var s100_text = formatter(s100/1000000) + " million";



  	  // percentIn = parseFloat(inp);

  	  d3.selectAll('.bar').remove();
      d3.selectAll('.label').remove();

  	  // var lowerBound = parseFloat((100.0 - 2*percentIn) / (100.0 - percentIn));

  	  
  	  // d3.tsv("data.tsv", type, function(error, data) {



  	    var bars = svg.selectAll(".bar")
  	      .data(summary);

        // bars.enter()







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



        bars.enter().append("text")
            .attr("class","bar_label")
            .attr("x", x("0.50%")+x.rangeBand()/5)
            .attr("y",  function(d){return y(d.s50/2);})
            .attr("dy", ".35em")
            .attr("fill","white")
            .text(s50_text)

        bars.enter().append("text")
            .attr("class","bar_label")
            .attr("x", x("0.75%")+x.rangeBand()/5)
            .attr("y",  function(d){return y(d.s75/2);})
            .attr("dy", ".35em")
            .attr("fill","white")
            .text(s75_text)


        bars.enter().append("text")
            .attr("class","bar_label")
            .attr("x", x("1.0%")+x.rangeBand()/5)
            .attr("y",  function(d){return y(d.s100/2);})
            .attr("dy", ".35em")
            .attr("fill","white")
            .text(s100_text)
	  // });

	}

	d3.select("#rate").on("input", function() {
  drawBars(+this.value, d3.select('#premium')[0][0].value);
});

d3.select("#premium").on("input", function() {
  drawBars(d3.select('#rate')[0][0].value,+this.value);
});

drawBars(3.66,.85);


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




});





// when the input range changes update value 


// jQuery(document).ready(function($) {
// //Set default open/close settings
// $('.acc_container').hide(); //Hide/close all containers

//     //On Click
// $('.acc_trigger').click(function(){

//   if ($(this).hasClass('active')){
//     $('.acc_trigger').removeClass('active').next().slideUp();
//   }

//  else{
//     $(this).addClass('active').next().slideDown();
//     // return false; //Prevent the browser jump to the link anchor
// }

// });

// $('.acc_trigger_arrow').click(function(){

//   if ($(this).hasClass('active')){
//     $('.acc_trigger_arrow').removeClass('active');

//     $('.acc_container').slideUp();
//   }

//  else{
//     $('.acc_trigger_arrow').addClass('active');

//     $('.acc_container').slideDown();

//     // return false; //Prevent the browser jump to the link anchor
// }

// });

    

    

// });


