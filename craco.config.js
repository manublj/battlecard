const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "querystring": require.resolve("querystring-es3"),
        "os": require.resolve("os-browserify/browser"),
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "buffer": require.resolve("buffer/"),
        "events": require.resolve("events/"),
        "path": require.resolve("path-browserify"),
        "fs": false,
        "net": false,
        "tls": false,
        "child_process": false,
        "http2": false,
        "process": require.resolve("process/browser.js"),
        "crypto": require.resolve("crypto-browserify"),
        "vm": require.resolve("vm-browserify")
      };
      return webpackConfig;
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer']
      }),
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        const mod = resource.request.replace(/^node:/, '');
        resource.request = mod;
      })
    ]
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.module.rules.push({
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
            exclude: [
              /node_modules\/google-spreadsheet/,
              /node_modules\/google-auth-library/,
              /node_modules\/gaxios/,
              /node_modules\/gcp-metadata/,
              /node_modules\/gtoken/,
              /node_modules\/https-proxy-agent/,
              /node_modules\/asn1.js/,
              /node_modules\/google-p12-pem/
            ]
          });
          return webpackConfig;
        }
      }
    }
  ]
};