/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (_env, args) => {
    const isProductionMode = args.mode === "production";

    return {
        mode: isProductionMode ? "production" : "development",
        entry: "./index.ts",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: isProductionMode
                ? "[name].[contenthash].js"
                : "[name].[hash].js",
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "index.html",
            }),
            new WasmPackPlugin({
                crateDirectory: path.resolve(__dirname, "."),
            }),
            // new webpack.ProvidePlugin({
            //     TextDecoder: ["text-encoding", "TextDecoder"],
            //     TextEncoder: ["text-encoding", "TextEncoder"],
            // }),
        ],
        experiments: {
            asyncWebAssembly: true,
        },
    };
};
