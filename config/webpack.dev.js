const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common');
const helpers = require('./helpers');
//const Dotenv = require('dotenv-webpack');

const PORT = process.env.PORT || 8080;
module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: path.join(__dirname, 'public'), //helpers.root('dist'),
        publicPath: //'https://one-menu-b2b.herokuapp.com:' + PORT + '/',
            '/',
        filename: '[name]-bundle.js', //[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.HotModuleReplacementPlugin(),
        //new Dotenv()
    ],

    devServer: {
        historyApiFallback: true,
        stats: {
            colors: true,
            chunks: false,
            hash: false,
            version: false,
            timings: false,
            assets: false,
            reasons: false,
            children: false,
            source: false,
            errors: false,
            errorDetails: false,
            warnings: false,
            noInfo: true
        }
    }
});