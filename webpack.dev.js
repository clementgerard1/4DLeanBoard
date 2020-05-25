const path = require('path');

module.exports = {
	mode:'development',
	watch : true,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  },
  module: {
	  rules: [
	    {
	      test: /\.m?js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['@babel/preset-env'],
	          plugins: ['@babel/plugin-proposal-class-properties']
	        }
	      }
	    },
	    {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    	},
    	{
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
	  ]
	}
};