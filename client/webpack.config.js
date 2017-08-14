config = {
  entry: { 
    app: [__dirname + '/public/app.js', __dirname + '/public/mapWrapper.js', __dirname + '/public/apiProcessing.js'],
  },
  output:{
    filename:'bundle.js',
    path: __dirname + '/build'
  },
  devtool:'source-map'
}

module.exports = config;



   
