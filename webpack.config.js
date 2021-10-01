var path = require("path");

module.exports = {
    entry: {
        playback: "./playback/client/index.js",
        recorder: "./recorder/client/index.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build/')
    },
    resolve: {
        extensions: ['.js', '.sass']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /(\.css|\.sass)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(gif|png|jpg|jpeg\ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                }
            }
        ],

    }
}