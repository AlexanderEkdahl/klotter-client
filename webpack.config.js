var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');

var TARGET = process.env.npm_lifecycle_event;

var configuration = {
    entry: "./src/index.tsx",
    output: {
        path: 'dist',
        filename: 'bundle-[hash].js',
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
            'process.env.NODE_ENV': '"production"'
        })
    );
    configuration.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
}


module.exports = configuration;
