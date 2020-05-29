const path = require('path');

module.exports = {
	mode:'production',
  entry: './src/index.js',
	node: {
		  fs: 'empty',
		  net:'empty',
		  tls: 'empty'
		},
  output: {
    path: path.resolve(__dirname, 'dist'),
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
	  ]
	}
};