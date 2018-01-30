const env = process.env.NODE_ENV || 'development';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

const plugins= [
    new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: 'body',
    })
];

console.log('NODE_ENV:', env);

if (env === 'production') {
plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeJsPlugin({
      sourceMap: false
    })
  );
};    


//webpack.config.js
module.exports = {
    entry: (env !== 'production' ? [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
    ] : []).concat(['./client/index.js']),
    output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'public'),
    }

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: /src/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                include: /css/,
                use: [
                    { 
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }

        ]
    },
    plugins: plugins
};