const { resolve } = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { SkeletonPlugin } = require("./skeleton")
module.exports = {
    mode: "development",
    devtool: false,
    entry: "./src/index.js",
    output: {
        path: resolve(__dirname, "dist"),
        filename: "main.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                        }
                    }
                ],
                exclude: /node_modules/
            },
        ],
    },
    devServer: {
        contentBase: resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new SkeletonPlugin({
            staticDir: resolve(__dirname, 'dist'),
            port: 8000,
            origin: 'http://localhost:8000',
            device: 'iPhone 6',
            defer: 5000,
            button: {
                color: '#EFEFEF'
            },
            image: {
                color: '#EFEFEF'
            },
        })
    ],
}
