var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SriPlugin = require('webpack-subresource-integrity');
var Clean = require('clean-webpack-plugin');

var TARGET = process.env.npm_lifecycle_event;

var configuration = {
    entry: "./src/index.tsx",
    output: {
        path: 'dist',
        filename: 'bundle-[hash].js',
        publicPath: '/',
        crossOriginLoading: false,
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=10000' },
            { test: /\.svg$/, loader: 'svg-inline' },
        ],

        preLoaders: [
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            cache: true,
            template: 'index.html',
        }),
    ],
};

if (TARGET === 'dist') {
    configuration.plugins.push(
        new Clean(['dist'])
    );
    configuration.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        })
    );
    configuration.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
    configuration.plugins.push(
        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384'],
        })
    );
}


module.exports = configuration;
