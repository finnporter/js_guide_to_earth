var ColumnChart = function() {
  var container = document.querySelector('#column-chart');

  var chart = new Highcharts.Chart({

    chart: {
      type: 'column',
      renderTo: container
    },
    title: {
      text: "Dummy Data"
    },
    series: [{
      name: "Number of Moons",
      data: [5, 1, 10, 1, 5]
    }],
    xAxis: {
      categories: ['Earth', 'Mars', 'Jupiter', 'Venus']
    }
  });
}