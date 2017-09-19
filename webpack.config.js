const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
    entry: {
        vendor: './src/vendor',
        index: './src/main.js'
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: options.dev ? '[name].js' : '[name].[chunkhash:8].js',
        chunkFilename: '[id].[chunkhash:8].js',
        publicPath: options.dev ? '/assets/' : publicPath
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: ['vue-loader']
        }, {
            test: /\.js$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],

        }, {
            test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    name: 'style/img/[name].[hash:8].[ext]'
                }
            }]
        }, {
            test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'style/font/[name].[hash:8].[ext]'
                }
            }]
        }]
    },
    devtool: "source-map",
    plugins: [
        new ExtractTextPlugin('[name].[contenthash:8].css'),
        new WebpackMd5Hash(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new InlineManifestWebpackPlugin({
            name: 'webpackManifest'
        })
    ],
    resolve: {
        alias: {
            '~': resolve(__dirname, 'src')
        }
    },
    devServer: {
        host: '127.0.0.1',
        port: 8014,
        proxy: {
            '/api/': {
                target: '127.0.0.1',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        historyApiFallback: {
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname
        }
    },
    devtool: options.dev ? '#eval-source-map' : '#source-map'
});