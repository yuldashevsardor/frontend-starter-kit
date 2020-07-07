const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const autoPrefixer = require('autoprefixer');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const isProd = !isDev;

const rootPath = path.join(__dirname, 'frontend', 'design');
const srcPath = path.join(rootPath, 'src');
const distPath = path.join(rootPath, 'dist');
const publicPath = path.join(__dirname, 'public_html');

const filename = (rPath, ext) => {
    // const fileName = isDev ? `[name].[hash].${ext}` : `[name].${ext}`;

    const fileName = `[name].${ext}`;

    return path.join(rPath, fileName);
};

const optimization = () => {
    const config = {};

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
};

const plugins = () => {

    const plugins = [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: path.join(srcPath, 'index.html'),
            minify: {
                collapseWhitespace: false
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('style', 'css')
        }),
        new CopyWebpackPlugin([
                    {
                        from: path.join(srcPath, 'files'),
                        to: path.join(distPath, 'files'),
                    },
                ]
        ),
        new FileManagerPlugin({
            onEnd: {
                copy: [
                    {
                        source: path.join(distPath, 'js'),
                        destination: path.join(publicPath, 'js')
                    },
                    {
                        source: path.join(distPath, 'style'),
                        destination: path.join(publicPath, 'style')
                    },
                    {
                        source: path.join(distPath, 'font'),
                        destination: path.join(publicPath, 'font')
                    },
                    {
                        source: path.join(distPath, 'image'),
                        destination: path.join(publicPath, 'image')
                    },
                ]
            }
        }),
    ];

    if (isProd) {
        plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerPort: 10101
                })
        );
    } else {
        plugins.push(new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
        }));
    }

    return plugins;
};

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    };

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
};

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: false,
                // publicPath: path.join(distPath, 'style')
            },
        },
        'css-loader'
    ];

    if (isProd) {
        loaders.push({
            loader: 'postcss-loader',
            options: {
                plugins: [
                    autoPrefixer()
                ],
                sourceMap: true
            }
        });
    }

    if (extra) {
        loaders.push(extra)
    }

    return loaders
};


const config = {
    context: srcPath,
    mode: env,
    entry: {
        app: ['@babel/polyfill', './js/index.js'],
    },
    output: {
        filename: filename('js', 'js'),
        path: path.join(distPath)
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@': srcPath,
        }
    },
    optimization: optimization(),
    devServer: {
        writeToDisk: true,
        // contentBase: distPath,
        watchContentBase: false,
        host: '0.0.0.0',
        port: 4200,
        hot: isDev,
        open: 'firefox'
    },
    devtool: isDev ? 'source-map' : '',
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: babelOptions()
                }]
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|jpeg|svg|webp|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        publicPath: '../',
                        esModule: false
                    }
                }]
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        publicPath: '../',
                    }
                }]
            },
            // {
            //     // Exposes jQuery for use outside Webpack build
            //     test: require.resolve('jquery'),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: 'jQuery'
            //     },{
            //         loader: 'expose-loader',
            //         options: '$'
            //     }]
            // }
        ]
    }
};

// if (isDev) {
//     config.module.rules.push({
//         test: require.resolve('jquery'),
//         use: [{
//             loader: 'expose-loader',
//             options: 'jQuery'
//         }, {
//             loader: 'expose-loader',
//             options: '$'
//         }]
//     })
// }

module.exports = config;