const path = require('path');

module.exports = {
	mode:'development',
	watch : true,
  entry: {
  	index : './test/src/index.js',
  	entry : './src/class/entry.js',
  	entryVue : './src/components/entry.js',
  },
  output: {
    path: path.resolve(__dirname, './test/build'),
    filename: '[name].js'
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