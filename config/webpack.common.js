const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers');

module.exports = {
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './public/main.jsx'
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    },

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                //exclude: helpers.root('v1', 'node_modules'),
                exclude: ['/node_modules/', 'public/v1'],
                loaders: [
                    'react-hot-loader',
                    'babel-loader?presets[]=react,presets[]=env'
                ]
            },
            {
                test: /\.js$/,
                //exclude: helpers.root('v1', 'node_modules'),
                exclude: ['/node_modules/', 'public/v1'],
                loaders: [
                    'babel-loader?presets[]=react,presets[]=env'
                ]
            },
            /*
            {
                test: /\.html$/,
                loader: 'html'
            },*/
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                exclude: ['/node_modules/', 'public/v1'],
                loaders: [
                    'babel-loader?presets[]=react,presets[]=env'
                ]
            },
            {
                test: /\.css$/,
                exclude: helpers.root('public', 'app'),
                exclude: ['/node_modules/', 'public/v1'],
                loaders: [
                    'babel-loader?presets[]=react,presets[]=env'
                ]
            },
            {
                test: /\.css$/,
                include: helpers.root('public', 'app'),
                exclude: ['/node_modules/', 'public/v1'],
                loaders: [
                    'babel-loader?presets[]=react,presets[]=env'
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['raw-loader', 'sass-loader?sourceMap']
            }
        ]
    },

    plugins: [
    /*
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app']
        }),
*/
/*
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        })*/
    ]
};