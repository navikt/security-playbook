const { CycloneDxWebpackPlugin } = require("@cyclonedx/webpack-plugin");

module.exports = function cyclonedxPlugin() {
  return {
    name: "cyclonedx-webpack-plugin",
    configureWebpack(_config, isServer) {
      if (isServer || process.env.NODE_ENV !== "production") {
        return {};
      }

      return {
        plugins: [
          new CycloneDxWebpackPlugin({
            specVersion: "1.6",
            outputLocation: "./cyclonedx",
            includeWellknown: false,
            reproducibleResults: true,
          }),
        ],
      };
    },
  };
};
