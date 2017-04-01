import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const BROWSER_LIST = [
  'Android >= 4',
  'Chrome >= 52',
  'Firefox >= 45',
  'Explorer >= 11',
  'last 2 Edge versions',
  'iOS >= 9',
  'Safari >= 10'
];
const GLOBALS = {
  __DEV__: DEBUG
};

export default {
  context: path.resolve(__dirname, 'src'),
  entry: './client.js',

  output: {
    path: path.resolve(__dirname, 'build/assets'),
    publicPath: '/assets/',
    filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: DEBUG ? '[name].[id].js?[chunkhash]' : '[name].[id].[chunkhash].js',
    sourcePrefix: '  '
  },

  target: 'web',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // https://github.com/babel/babel-loader#options
            cacheDirectory: DEBUG,

            // https://babeljs.io/docs/usage/options/
            babelrc: false,
            presets: [
              ['env', {
                debug: VERBOSE,
                node: 'current',
                useBuiltIns: true,
                targets: {
                  browsers: BROWSER_LIST
                },
                modules: false
              }],
              'react'
            ],
            plugins: [
              'react-hot-loader/babel',
              'transform-decorators-legacy',
              'transform-do-expressions',
              'transform-export-extensions',
              'syntax-dynamic-import',
              'transform-class-properties',
              'transform-object-rest-spread',
              ['import', {
                style: 'css',
                libraryName: 'antd'
              }],
              ...DEBUG ? ['react-hot-loader/babel'] : [
                  'transform-react-remove-prop-types',
                  'transform-react-constant-elements',
                  'transform-react-inline-elements'
                ]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: DEBUG,

              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',

              // CSS Nano http://cssnano.co/options/
              minimize: !DEBUG
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              parser: 'postcss-scss',
              plugins: function () {
                return [
                  require('postcss-import')(),
                  require('precss')(),
                  require('autoprefixer')({browsers: BROWSER_LIST})
                ];
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: DEBUG,

              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: '[local]',

              // CSS Nano http://cssnano.co/options/
              minimize: !DEBUG
            }
          }
        ]
      },
      {
        test: /\.txt$/,
        use: 'raw-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
            limit: 10000
          }
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]'
          }
        },
      },
      {
        test: /\.(jade|pug)$/,
        use: 'pug-loader'
      }
    ]
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json']
  },

  cache: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },


  plugins: [
    ...!DEBUG ? [] : [
        // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),

        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin()
      ],

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({...GLOBALS, 'process.env.BROWSER': true}),

    // Assign the module and chunk ids by occurrence count
    // Consistent ordering of modules required if using any hashing ([hash] or [chunkhash])
    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    // new webpack.optimize.OccurenceOrderPlugin(true),

    ...DEBUG ? [] : [

        // Minimize all JavaScript output of chunks
        // https://github.com/mishoo/UglifyJS2#compressor-options
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            screw_ie8: true, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
            warnings: VERBOSE
          }
        }),

        // A plugin for a more aggressive chunk merging strategy
        // https://webpack.github.io/docs/list-of-plugins.html#aggressivemergingplugin
        new webpack.optimize.AggressiveMergingPlugin()
      ],
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'index.pug',
      inject: false,
      __DEV__: DEBUG
    })
  ],

  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  devServer: {
    publicPath: '/assets/',
    contentBase: path.join(__dirname, 'build'),
    inline: true,
    historyApiFallback: true,
    hot: true,
    port: 3001
  }
}
