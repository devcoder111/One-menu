const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');
const webpackCompiler = webpack(webpackConfig);

// Enable webpack middleware for hot-reloads in development
let useWebpackMiddleware = (app) => {
    app.use(webpackDevMiddleware(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: true, // Hide extra in terminal
            'errors-only': false
        }
    }));
    app.use(webpackHotMiddleware(webpackCompiler, {
        log: console.log
    }));

    return app;
}

module.exports = useWebpackMiddleware;