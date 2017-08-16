var PieChart = function() {
  var container = document.querySelector('#pie-chart');

  var chart = new Highcharts.Chart({

    chart: {
      type: 'pie',
      renderTo: container
    },
    title: {
      text: "Common Atmospheric Elements"
    },
    series: [{
      name: 'Gas',
      data: [{
        name: "Nitrogen",
        y: 78.084,
        color: "#ffac33"
      }, {
        name: "Oxygen",
        y: 20.946,
        color: "#0000ff"
      }, {
        name: "Argon",
        y: 0.9340,
        color: "#00ff00",
        sliced: true
      }]
    }]

  });
}