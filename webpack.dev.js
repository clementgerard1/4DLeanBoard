const path = require('path');

module.exports = {
	mode:'development',
	node: {
		  fs: 'empty',
		  net:'empty',
		  tls: 'empty'
		},
	watch : true,
	entry: {
  	bundle : './src/index.js',
  	bundle3D : './src/index3D.js',
  	bundleW6 : './src/indexW6.js',
  	bundleBackend : './src/backend.js'
  },
  output: {
    path: path.resolve(__dirname, 'dev'),
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
	          plugins: ['@babel/plugin-proposal-class-properties', 
	          	"@babel/plugin-proposal-private-methods"],
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
      	{
        	test: /\.s[ac]ss$/i,
        	use: [ 'style-loader', 'css-loader', 'sass-loader']
      	},
	  ]
	}
};