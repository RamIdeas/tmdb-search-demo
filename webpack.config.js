const { resolve } = require('path');
const webpack = require('webpack');
const externals = require('webpack-node-externals')();

const BABEL_CLIENT_CONFIG = require(resolve(__dirname, '.babelrc.client.js'));
const BABEL_SERVER_CONFIG = require(resolve(__dirname, '.babelrc.js'));

const SRC_DIR = resolve(__dirname, 'src');
const DESTINATION_DIR = resolve(__dirname, 'build');

const CLIENT_PRODUCTION_PLUGINS = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
            warnings: false, // Suppress uglification warnings
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
        },
        output: {
            comments: false,
        },
        exclude: [/\.min\.js$/gi], // skip pre-minified libs
    }),
];

const COMMON_CONFIG = BABEL_CONFIG => ({
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: BABEL_CONFIG,
                    },
                ],
            },
            {
                test: /\.(ts|tsx|js)$/,
                use: ['source-map-loader'],
            },
        ],
    },
    output: {
        path: DESTINATION_DIR,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: ['node_modules'],
    },
});

const CLIENT_CONFIG = {
    target: 'web',
    entry: {
        client: resolve(SRC_DIR, 'client/index.tsx'),
    },
    ...COMMON_CONFIG(BABEL_CLIENT_CONFIG),
    plugins: process.env.NODE_ENV !== 'production' ? [] : CLIENT_PRODUCTION_PLUGINS,
};

const SERVER_CONFIG = {
    target: 'node',
    entry: {
        server: resolve(SRC_DIR, 'server/index.ts'),
    },
    externals: externals,
    node: {
        __dirname: false,
        __filename: false,
    },
    ...COMMON_CONFIG(BABEL_SERVER_CONFIG),
};

module.exports = [CLIENT_CONFIG, SERVER_CONFIG];
