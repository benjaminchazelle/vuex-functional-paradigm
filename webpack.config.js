const path = require("path");

module.exports = {
  mode: "production",

  entry: ["@babel/polyfill", "./src/index.js"],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vuex-functional-paradigm.js",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
