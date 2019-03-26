/**
 * @file webpack config
 */

import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import cssnano from 'cssnano';

export default {
    mode: 'production',
    entry: [
        './src/js/plyr.js',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'player.webpack.js',
    },
    resolve: {

    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve('src'),
                ],
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['@babel/preset-env'],
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-transform-new-target',
                        ],
                    },
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:7].css',
            chunkFilename: 'css/common/[contenthash:7].css',
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG_PROD: 'false',
        }),
    ],

    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '.',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
            },
        },
        minimizer: [
            new UglifyJsPlugin({
                extractComments: true,
                sourceMap: false,
                parallel: true,
                uglifyOptions: {
                    compress: {
                        'drop_console': true,
                    },
                    toplevel: true,
                    'dead_code': true,
                },
            }),
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: cssnano({
                    reduceIdents: false,
                    reduceTransforms: false,
                    discardUnused: {
                        disable: true,
                    },
                    zindex: false,
                }),
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true,
                    },
                },
                canPrint: true,
            }),
        ],
    },
};