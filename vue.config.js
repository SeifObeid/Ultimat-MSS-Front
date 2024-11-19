const path = require("path");

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  // outputDir: path.resolve(__dirname, "../backend/templates/SPA"),
  // assetsDir: "../../static/SPA"
  outputDir: path.resolve(__dirname, "./dist"),
  //assetsDir: "MSS/static",
  assetsDir: "static",
  publicPath: './'
}




// const path = require("path");

// module.exports = {
//   lintOnSave: false,
//   runtimeCompiler: true,
//   // outputDir: path.resolve(__dirname, "../backend/templates/SPA"),
//   // assetsDir: "../../static/SPA"
//   outputDir: path.resolve(__dirname, "./dist"),
//   assetsDir: "MSS/static",
//   // assetsDir: "static",
//    baseUrl: './',
//    productionSourceMap: false,
//    configureWebpack: { devtool: process.env.NODE_ENV === "development" ? "source-map" : "" },
// }
