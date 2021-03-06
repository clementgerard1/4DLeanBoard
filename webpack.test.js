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
  	index : './test-pages/src/index.js',
  	entry : './src/class/entry.js',
  	entryVue : './src/components/entry.js',
  	dataEntry : './dataServer/dataEntry.js'
  },
  output: {
    path: path.resolve(__dirname, './test-pages/build'),
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
        test: /\.csv$/i,
        use: 'raw-loader',
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